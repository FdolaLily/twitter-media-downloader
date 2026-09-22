const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const script = fs.readFileSync(require('node:path').join(__dirname, '..', 'script.js'), 'utf8');
const sandbox = {
    console, Blob, URL, AbortController, AbortSignal, setTimeout, clearTimeout,
    document: { documentElement: { lang: 'en' } }, location: { hostname: 'x.com' },
    fetch: async () => new Response(null, { headers: { 'content-length': '1024' } }),
    GM_download: () => {},
};
vm.createContext(sandbox);
vm.runInContext(script.replace('new TwitterMediaDownloaderApp().init();', '') + '\nthis.test = { MediaSize, GifConverter, GifWorkerPool, GifTrimRange, DownloadQueue, TwitterAPI, TwitterMediaDownloaderApp, UIManager, TmdGifenc };', sandbox);
const { MediaSize, GifConverter, GifWorkerPool, GifTrimRange, DownloadQueue, TwitterAPI, TwitterMediaDownloaderApp, UIManager, TmdGifenc } = sandbox.test;
let passed = 0;
async function check(name, run) { await run(); passed++; console.log('PASS', name); }
const media = (type, id) => ({ type, media_url_https: `https://pbs.twimg.com/media/${id}.jpg`, video_info: { variants: [
    { content_type: 'application/x-mpegURL', url: `https://video.twimg.com/${id}.m3u8` },
    { content_type: 'video/mp4', bitrate: 100, url: `https://video.twimg.com/${id}-low.mp4` },
    { content_type: 'video/mp4', bitrate: 500, url: `https://video.twimg.com/${id}-high.mp4` },
] } });
async function plan(medias, options = {}) {
    const tasks = [], statuses = [], history = [], notices = [];
    TwitterAPI.fetchTweetJson = async () => ({ legacy: { created_at: '2026-09-17T00:00:00Z', extended_entities: { media: medias } }, core: { user_results: { result: { legacy: { name: 'Tester', screen_name: 'tester' } } } } });
    const app = new TwitterMediaDownloaderApp();
    app.storage = { filenamePattern: '{file-type}-{index}.{file-ext}', saveHistoryFlag: true, addHistory: async item => history.push(item) };
    app.ui = { setButtonStatus: (btn, status) => statuses.push(status), showNotice: text => notices.push(text), updateHistoryCount() {}, lang: { completed: 'Done' } };
    app.queue = { add: task => tasks.push(task) };
    await app.handleDownloadClick({ classList: { contains: () => false }, dataset: {} }, '123', false, null, 'unknown', 'unknown', options);
    return { tasks, statuses, history, notices };
}

// Walk GIF blocks independently of the encoder to verify frames and timing.
function assertGifAnimation(bytes, expectedFrames, expectedDuration) {
    let offset = 13;
    if (bytes[10] & 0x80) offset += 3 * (1 << ((bytes[10] & 7) + 1));
    let frames = 0, duration = 0, loop = null, trailer = false;
    const skipBlocks = () => {
        while (offset < bytes.length) {
            const size = bytes[offset++];
            if (!size) return;
            offset += size;
            assert.ok(offset <= bytes.length, 'GIF subblock fits in file');
        }
        assert.fail('Missing GIF subblock terminator');
    };
    while (offset < bytes.length) {
        const marker = bytes[offset++];
        if (marker === 0x3b) { trailer = true; break; }
        if (marker === 0x21) {
            const label = bytes[offset++];
            if (label === 0xf9) {
                assert.equal(bytes[offset++], 4);
                duration += bytes.readUInt16LE(offset + 1) * 10;
                offset += 4;
                assert.equal(bytes[offset++], 0);
            } else if (label === 0xff) {
                const length = bytes[offset++];
                const identifier = bytes.subarray(offset, offset + length).toString();
                offset += length;
                if (identifier === 'NETSCAPE2.0') loop = bytes.readUInt16LE(offset + 2);
                skipBlocks();
            } else { skipBlocks(); }
        } else if (marker === 0x2c) {
            frames++;
            const packed = bytes[offset + 8];
            offset += 9;
            if (packed & 0x80) offset += 3 * (1 << ((packed & 7) + 1));
            offset++; // LZW minimum code size
            skipBlocks();
        } else { assert.fail('Unexpected GIF block: ' + marker); }
    }
    assert.equal(trailer, true);
    assert.equal(offset, bytes.length);
    assert.equal(frames, expectedFrames);
    assert.equal(duration, expectedDuration);
    assert.equal(loop, 0);
}

(async () => {
    await check('timeline endpoints stop expansion at 15s and allow immediate inward movement', async () => {
        const range = { start: 10, end: 20 };
        const right = GifTrimRange.adjust(range, 'end', 29, 60, 15);
        assert.equal(right.start, 10); assert.equal(right.end, 25); assert.equal(right.limited, true);
        const left = GifTrimRange.adjust(range, 'start', 0, 60, 15);
        assert.equal(left.start, 5); assert.equal(left.end, 20); assert.equal(left.limited, true);
        assert.equal(GifTrimRange.adjust(range, 'end', 25, 60, 15).limited, false);
        const inward = GifTrimRange.adjust(right, 'end', 24.9, 60, 15);
        assert.equal(inward.end, 24.9); assert.equal(inward.limited, false);
        const inwardLeft = GifTrimRange.adjust(left, 'start', 5.1, 60, 15);
        assert.equal(inwardLeft.start, 5.1); assert.equal(inwardLeft.limited, false);
    });
    await check('moving a 15s selection preserves length and stops at source boundaries', async () => {
        const range = { start: 0, end: 15 };
        for (const target of [-8, 1, 12.5, 45, 90]) {
            const result = GifTrimRange.adjust(range, 'move', target, 60, 15);
            assert.equal(result.end - result.start, 15);
            assert.ok(result.start >= 0 && result.end <= 60);
            assert.equal(result.limited, false);
        }
        assert.equal(GifTrimRange.adjust(range, 'move', 90, 60, 15).start, 45);
    });
    await check('timeline never crosses endpoints or permits empty, negative or overlong output', async () => {
        const range = { start: 10, end: 12 };
        for (const part of ['start', 'end', 'move']) {
            for (const value of [-100, 0, 10, 11.99, 12, 12.01, 23, 45, 99, NaN]) {
                const result = GifTrimRange.adjust(range, part, value, 45, 15);
                GifConverter.validateRange(result, 45, 15);
            }
        }
        assert.equal(GifTrimRange.adjust(range, 'start', 20, 45, 15).start, 11.99);
        assert.equal(GifTrimRange.adjust(range, 'end', 5, 45, 15).end, 10.01);
    });
    await check('explicit short-video action converts videos only, preserves original indexes and GIF history', async () => {
        const video = media('video', 'v'); video.video_info.duration_millis = 15000;
        const p = await plan([media('photo', 'p'), video], { videoGif: true });
        assert.equal(p.tasks.length, 1);
        assert.equal(p.tasks[0].name, 'gif-2.gif');
        assert.equal(p.tasks[0].gif, true);
        assert.equal(p.tasks[0].gifOptions.maxSeconds, 15);
        assert.equal(p.tasks[0].gifOptions.requireVideo, true);
        await p.tasks[0].onload(1048576);
        assert.equal(p.history[0].type, 'gif');
        assert.equal(p.history[0].size, '1.00 MB');
        assert.equal((await plan([video])).tasks[0].name, 'video-1.mp4');
    });
    await check('long videos reach the trim workflow; photo-only posts show a notice', async () => {
        const video = media('video', 'v'); video.video_info.duration_millis = 60000;
        const p = await plan([video], { videoGif: true });
        assert.equal(p.tasks.length, 1); assert.equal(p.statuses.at(-1), 'loading');
        assert.equal(typeof p.tasks[0].gifOptions.editRange, 'function');
        assert.equal(p.notices.length, 0);
        const photo = await plan([media('photo', 'p')], { videoGif: true });
        assert.equal(photo.tasks.length, 0); assert.match(photo.notices[0], /No video/);
    });
    await check('missing API duration still requires decoding and enforcing the 15-second limit', async () => {
        const p = await plan([media('video', 'v')], { videoGif: true });
        assert.equal(p.tasks.length, 1); assert.equal(p.tasks[0].gifOptions.maxSeconds, 15);
        GifConverter.validateDuration(15, 15);
        assert.throws(() => GifConverter.validateDuration(15.001, 15), /15s/);
        assert.throws(() => GifConverter.validateDuration(NaN, 15), /invalid/);
        await p.tasks[0].onerror(new Error('over limit'));
        assert.equal(p.history.length, 0); assert.equal(p.notices[0], 'over limit');
    });
    await check('mixed gallery: GIF extension, highest MP4 source, independent filenames and actual GIF size', async () => {
        const p = await plan([media('animated_gif', 'a'), media('photo', 'b'), media('video', 'c')]);
        assert.deepEqual(Array.from(p.tasks, x => x.name), ['gif-1.gif', 'photo-2.jpg', 'video-3.mp4']);
        assert.equal(p.tasks[0].url, 'https://video.twimg.com/a-high.mp4');
        assert.equal(p.tasks[1].url, 'https://pbs.twimg.com/media/b.jpg:orig');
        assert.equal(p.tasks[2].gif, false);
        await p.tasks[1].onload(); await p.tasks[0].onload(1048576); await p.tasks[2].onload();
        assert.equal(p.statuses.at(-1), 'completed');
        assert.equal(p.history[0].size, '1.00 MB');
        assert.equal(p.history[0].type, 'Gallery');
    });
    await check('missing GIF source cannot turn into success when a sibling completes', async () => {
        const missing = media('animated_gif', 'a'); missing.video_info.variants = [];
        const p = await plan([missing, media('photo', 'b')]);
        await p.tasks[0].onload();
        assert.equal(p.statuses.at(-1), 'failed'); assert.equal(p.history.length, 0);
    });
    await check('native GIF variant preferred', async () => {
        const gif = media('animated_gif', 'a');
        gif.video_info.variants.push({ content_type: 'image/gif', url: 'https://video.twimg.com/original.gif' });
        assert.equal((await plan([gif])).tasks[0].url, 'https://video.twimg.com/original.gif');
    });
    const enc = TmdGifenc.GIFEncoder();
    enc.writeFrame(new Uint8Array([0,1,1,0]), 2, 2, { palette: [[255,0,0], [0,0,255]], delay: 100, repeat: 0 });
    enc.finish();
    const originalGif = new Blob([enc.bytesView()], { type: 'image/gif' });
    await check('real GIF sources preserved byte for byte', async () => {
        sandbox.fetch = async () => new Response(originalGif);
        const result = await GifConverter.convert('mock-native-gif');
        assert.deepEqual(Buffer.from(await result.arrayBuffer()), Buffer.from(await originalGif.arrayBuffer()));
    });
    let removed = false;
    class FakeVideo extends EventTarget {
        constructor() { super(); this.style = {}; this._time = 0; this.duration = 1; this.videoWidth = 4; this.videoHeight = 2; }
        load() { if (this.src) queueMicrotask(() => this.dispatchEvent(new Event('loadeddata'))); }
        get currentTime() { return this._time; }
        set currentTime(value) { this._time = value; queueMicrotask(() => this.dispatchEvent(new Event('seeked'))); }
        pause() {} removeAttribute() { this.src = ''; } remove() { removed = true; }
    }
    const fakeVideo = new FakeVideo();
    const sampledTimes = [];
    const context = { drawImage() { sampledTimes.push(fakeVideo.currentTime); }, getImageData() {
        const rgba = new Uint8ClampedArray(4 * 2 * 4);
        for (let i = 0; i < rgba.length; i += 4) { rgba[i] = Math.round(fakeVideo.currentTime * 255); rgba[i+2] = 255-rgba[i]; rgba[i+3] = 255; }
        return { data: rgba };
    } };
    sandbox.document.body = { appendChild() {} };
    sandbox.document.createElement = tag => tag === 'video' ? fakeVideo : { getContext: () => context };
    await check('frame sampling produces an actual animated GIF, complete duration and cleanup', async () => {
        sandbox.fetch = async () => new Response(new Blob(['mock-mp4'], { type: 'video/mp4' }));
        const progress = [];
        const blob = await GifConverter.convert('mock-mp4', p => progress.push(p));
        const result = Buffer.from(await blob.arrayBuffer());
        assert.equal(result.subarray(0, 6).toString(), 'GIF89a');
        assert.equal(blob.type, 'image/gif'); assert.equal(removed, true);
        assert.equal(progress.at(-1), 'GIF 100%');
        assertGifAnimation(result, 15, 1000);
    });
    await check('overlong animations fail instead of silently truncating', async () => {
        fakeVideo.duration = 121;
        await assert.rejects(GifConverter.convert('too-long'), /limit/);
        fakeVideo.duration = 1;
    });
    await check('decoded duration is authoritative; the video cap does not affect animated GIFs', async () => {
        fakeVideo.duration = 15.001;
        await assert.rejects(GifConverter.convert('short-video', undefined, { maxSeconds: 15, requireVideo: true }), /15s/);
        fakeVideo.duration = 15;
        const blob = await GifConverter.convert('fifteen-second-video', undefined, { maxSeconds: 15, requireVideo: true, editRange: () => assert.fail('No editor at 15s') });
        assertGifAnimation(Buffer.from(await blob.arrayBuffer()), 225, 15000);
        fakeVideo.duration = 16;
        const animation = await GifConverter.convert('animated-gif');
        assertGifAnimation(Buffer.from(await animation.arrayBuffer()), 240, 16000);
        fakeVideo.duration = 1;
    });
    await check('trim uses selected source offset, output duration, and the already fetched source', async () => {
        fakeVideo.duration = 45;
        sampledTimes.length = 0;
        let previewUrl, fetches = 0;
        sandbox.fetch = async () => { fetches++; return new Response(new Blob(['mock-mp4'])); };
        const blob = await GifConverter.convert('long-video', undefined, {
            maxSeconds: 15, requireVideo: true,
            editRange: async source => {
                assert.equal(source.duration, 45); assert.equal(source.maxSeconds, 15);
                previewUrl = source.url;
                assert.equal(await (await fetch(previewUrl)).text(), 'mock-mp4');
                return { start: 22, end: 24.5 };
            }
        });
        assert.equal(fetches, 1);
        assert.equal(sampledTimes[0], 22);
        assert.ok(sampledTimes.every(time => time >= 22 && time < 24.5));
        assertGifAnimation(Buffer.from(await blob.arrayBuffer()), 38, 2500);
        await assert.rejects(fetch(previewUrl));
        fakeVideo.duration = 1;
    });
    await check('invalid, reversed, out-of-source and over-limit ranges cannot encode', async () => {
        fakeVideo.duration = 30;
        for (const range of [{ start: NaN, end: 2 }, { start: 0, end: 0 }, { start: 5, end: 4 }, { start: -1, end: 2 }, { start: 20, end: 31 }, { start: 0, end: 15.01 }]) {
            await assert.rejects(GifConverter.convert('bad-range', undefined, { maxSeconds: 15, editRange: () => range }), /invalid|limit/);
        }
        GifConverter.validateRange({ start: 0.01, end: 15.01 }, 30, 15);
        fakeVideo.duration = 1;
    });
    await check('cancelling releases preview source, queue and post state without history', async () => {
        fakeVideo.duration = 30;
        let previewUrl;
        await assert.rejects(GifConverter.convert('cancel', undefined, { maxSeconds: 15, editRange: source => { previewUrl = source.url; return null; } }), error => error.code === 'GIF_CANCELLED');
        await assert.rejects(fetch(previewUrl));
        fakeVideo.duration = 1;
        assert.equal((await GifConverter.convert('after-cancel')).type, 'image/gif');
        const p = await plan([media('video', 'a'), media('video', 'b')], { videoGif: true });
        p.tasks[0].oncancel();
        await p.tasks[1].onload(100);
        assert.equal(p.statuses.at(-1), 'download'); assert.equal(p.history.length, 0);
        assert.equal(p.notices.length, 0);
        const single = await plan([media('video', 'c')], { videoGif: true });
        single.tasks[0].oncancel();
        assert.equal(single.statuses.at(-1), 'download');
    });
    await check('GIF size choice produces the selected frame rate and complete duration', async () => {
        const savedThreshold = MediaSize.threshold;
        MediaSize.threshold = 1;
        try {
            let dialogs = 0;
            const blob = await GifConverter.convert('size-choice', undefined, { chooseSize: ({ kind, choices }) => {
                dialogs++;
                assert.equal(kind, 'GIF'); assert.equal(choices.length, 3);
                assert.equal(choices[0].id, 'large'); assert.ok(choices[0].bytes > choices[1].bytes);
                assert.ok(choices[1].bytes > choices[2].bytes); assert.equal(choices[2].fps, 10);
                assert.equal(choices[0].estimated, true);
                return 'small';
            } });
            assert.equal(dialogs, 1);
            assertGifAnimation(Buffer.from(await blob.arrayBuffer()), 10, 1000);
            const dimensions = GifConverter.profiles({ videoWidth: 1920, videoHeight: 1080 });
            assert.deepEqual(Array.from(dimensions, p => [p.width, p.height, p.fps]), [[640,360,15],[480,270,12],[320,180,10]]);
        } finally { MediaSize.threshold = savedThreshold; }
    });
    await check('small GIFs skip the picker; cancelling a large estimate releases resources', async () => {
        await GifConverter.convert('small-gif', undefined, { chooseSize: () => assert.fail('No dialog under 10 MiB') });
        const savedThreshold = MediaSize.threshold;
        MediaSize.threshold = 1;
        removed = false;
        try {
            await assert.rejects(GifConverter.convert('cancel-size', undefined, { chooseSize: () => null }), error => error.code === 'GIF_CANCELLED');
            assert.equal(removed, true);
        } finally { MediaSize.threshold = savedThreshold; }
    });
    await check('underestimated GIF above the threshold offers actual largest size without re-encoding it', async () => {
        const savedThreshold = MediaSize.threshold;
        const writeFrame = GifConverter.writeFrame;
        MediaSize.threshold = 300;
        const encoders = new Set();
        let dialogs = 0, actualSize;
        GifConverter.writeFrame = async function(video, canvas, context, encoder, time, delay) {
            if (!encoders.size) {
                const bytesView = encoder.bytesView;
                encoder.bytesView = () => bytesView().subarray(0, 10);
            }
            encoders.add(encoder);
            return writeFrame.call(this, video, canvas, context, encoder, time, delay);
        };
        try {
            const blob = await GifConverter.convert('underestimated', undefined, { chooseSize: ({ choices }) => {
                dialogs++;
                assert.equal(choices[0].estimated, false);
                assert.ok(choices[0].bytes > MediaSize.threshold);
                actualSize = choices[0].bytes;
                return 'large';
            } });
            assert.equal(dialogs, 1); assert.equal(encoders.size, 4); // Three samples and one full encode.
            assert.equal(blob.size, actualSize);
            assertGifAnimation(Buffer.from(await blob.arrayBuffer()), 15, 1000);
        } finally { GifConverter.writeFrame = writeFrame; MediaSize.threshold = savedThreshold; }
    });
    await check('HTTP failure propagates and subsequent conversion still works', async () => {
        sandbox.fetch = async () => new Response('', { status: 403 });
        await assert.rejects(GifConverter.convert('bad'), /403/);
        sandbox.fetch = async () => new Response(originalGif);
        assert.equal((await GifConverter.convert('good')).type, 'image/gif');
    });
    await check('worker pipeline preserves exact GIF bytes and frame order with bounded parallelism', async () => {
        sandbox.fetch = async () => new Response(new Blob(['mock-mp4']));
        const baseline = Buffer.from(await (await GifConverter.convert('serial')).arrayBuffer());
        const workers = [];
        let active = 0, peak = 0, sequence = 0;
        sandbox.navigator = { hardwareConcurrency: 8 };
        sandbox.Worker = class {
            constructor() { workers.push(this); queueMicrotask(() => this.onmessage?.({data:{ready:true}})); }
            postMessage(buffer) {
                active++; peak = Math.max(peak, active);
                const rgba = new Uint8Array(buffer);
                const palette = TmdGifenc.quantize(rgba, 256);
                const pixels = TmdGifenc.applyPalette(rgba, palette);
                setTimeout(() => { active--; if (!this.terminated) this.onmessage({data:{palette,pixels:pixels.buffer}}); }, sequence++ % 2 ? 1 : 12);
            }
            terminate() { this.terminated = true; }
        };
        try {
            const result = Buffer.from(await (await GifConverter.convert('parallel')).arrayBuffer());
            assert.deepEqual(result, baseline);
            assert.equal(peak, 2); assert.equal(workers.length, 2);
            assert.ok(workers.every(worker => worker.terminated));
        } finally { delete sandbox.Worker; }
    });
    await check('blocked or failed workers fall back to serial encoding without corrupting output', async () => {
        const baseline = Buffer.from(await (await GifConverter.convert('serial')).arrayBuffer());
        sandbox.Worker = class { constructor() { throw new Error('CSP blocked'); } };
        try {
            assert.deepEqual(Buffer.from(await (await GifConverter.convert('blocked')).arrayBuffer()), baseline);
            sandbox.Worker = class {
                constructor() { queueMicrotask(() => this.onmessage?.({data:{ready:true}})); }
                postMessage() { queueMicrotask(() => this.onerror({message:'worker failed',preventDefault(){}})); }
                terminate() {}
            };
            assert.deepEqual(Buffer.from(await (await GifConverter.convert('failed')).arrayBuffer()), baseline);
        } finally { delete sandbox.Worker; }
    });
    const savedConvert = GifConverter.convert;
    await check('download retries encode once and report success only once', async () => {
        let conversions = 0, attempts = 0, success = 0, failed = 0, downloadUrl;
        GifConverter.convert = async (url, progress, options) => { conversions++; assert.equal(options.maxSeconds, 15); return originalGif; };
        sandbox.GM_download = o => { downloadUrl = o.url; attempts++; if (attempts < 3) o.onerror(new Error('temporary')); else o.onload(); };
        await new DownloadQueue().start({ gif: true, gifOptions: { maxSeconds: 15 }, url: 'source.mp4', name: 'output.gif', onload: n => { success++; assert.equal(n, originalGif.size); }, onerror: () => failed++ });
        assert.equal(conversions, 1); assert.equal(attempts, 3); assert.equal(success, 1); assert.equal(failed, 0);
        await assert.rejects(fetch(downloadUrl)); // Object URL is released after download completes.
    });
    await check('conversion failure never falls back to an MP4 download', async () => {
        let downloads = 0, failures = 0;
        GifConverter.convert = async () => { throw new Error('decode failure'); };
        sandbox.GM_download = () => downloads++;
        await new DownloadQueue().start({ gif: true, url: 'source.mp4', name: 'output.gif', onload: () => assert.fail(), onerror: () => failures++ });
        assert.equal(downloads, 0); assert.equal(failures, 1);
    });
    await check('ordinary downloads preserve URL; synchronous errors release the queue', async () => {
        let attempts = 0, failures = 0;
        sandbox.GM_download = o => { assert.equal(o.url, 'plain.mp4'); attempts++; throw new Error('disabled'); };
        const q = new DownloadQueue();
        await q.start({ url: 'plain.mp4', name: 'plain.mp4', onerror: () => failures++ });
        assert.equal(attempts, 3); assert.equal(failures, 1);
    });
    await check('cancelled encoding invokes cancellation once and never downloads', async () => {
        let cancelled = 0;
        GifConverter.convert = async () => { throw Object.assign(new Error('cancelled'), { code: 'GIF_CANCELLED' }); };
        sandbox.GM_download = () => assert.fail('Must not download after cancellation');
        await new DownloadQueue().start({ gif: true, oncancel: () => cancelled++, onerror: () => assert.fail('Cancellation is not an error'), onload: () => assert.fail() });
        assert.equal(cancelled, 1);
    });
    GifConverter.convert = savedConvert;
    await check('final download gate catches an oversized GIF even if converter skipped its picker', async () => {
        let downloaded = 0, decisions = 0;
        const actual = new Blob([new Uint8Array(MediaSize.threshold + 1234)], {type:'image/gif'});
        GifConverter.convert = async () => actual;
        sandbox.GM_download = task => { assert.equal(decisions, 1); downloaded++; task.onload(); };
        try {
            await new DownloadQueue(({choices}) => {
                decisions++;
                assert.equal(choices[0].bytes, actual.size); assert.equal(choices[0].estimated, false);
                return choices[0].id;
            }).start({gif:true,url:'source',name:'actual.gif',onload: bytes=>assert.equal(bytes, actual.size),onerror:error=>assert.fail(error.message)});
            assert.equal(downloaded, 1); assert.equal(decisions, 1);
        } finally { GifConverter.convert = savedConvert; }
    });
    await check('large unapproved GIF cannot download when its final picker is missing or cancelled', async () => {
        let failures = 0, cancelled = 0;
        GifConverter.convert = async () => new Blob([new Uint8Array(MediaSize.threshold + 1)], {type:'image/gif'});
        sandbox.GM_download = () => assert.fail('Unapproved file must not download');
        try {
            await new DownloadQueue().start({gif:true,onload:()=>assert.fail(),onerror:error=>{ failures++; assert.match(error.message,/selection unavailable/); }});
            await new DownloadQueue(()=>null).start({gif:true,onload:()=>assert.fail(),onerror:()=>assert.fail(),oncancel:()=>cancelled++});
            assert.equal(failures, 1); assert.equal(cancelled, 1);
        } finally { GifConverter.convert = savedConvert; }
    });
    await check('an already reviewed result skips duplicate dialogs; fallback resizing preserves trim', async () => {
        const approved = new Blob([new Uint8Array(MediaSize.threshold + 2)], {type:'image/gif'});
        MediaSize.approvedGifs.add(approved);
        GifConverter.convert = async () => approved;
        sandbox.GM_download = task => task.onload();
        try {
            await new DownloadQueue(()=>assert.fail('Duplicate picker')).start({gif:true,onload(){},onerror:error=>assert.fail(error.message)});
            const unapproved = new Blob([new Uint8Array(MediaSize.threshold + 3)], {type:'image/gif'});
            const profiles = GifConverter.profiles({videoWidth:640,videoHeight:360});
            GifConverter.outputs.set(unapproved, {range:{start:5,end:7.5},profiles});
            let conversions = 0;
            GifConverter.convert = async (url, progress, options) => {
                if (++conversions === 1) return unapproved;
                assert.equal(options.profileId, 'small'); assert.equal(options.sizeApproved, true);
                assert.equal(options.range.start, 5); assert.equal(options.range.end, 7.5);
                return originalGif;
            };
            await new DownloadQueue(()=> 'small').start({gif:true,url:'source.mp4',onload:bytes=>assert.equal(bytes,originalGif.size),onerror:error=>assert.fail(error.message)});
            assert.equal(conversions, 2);
        } finally { GifConverter.convert = savedConvert; }
    });
    await check('GIF source selection avoids decoding unnecessarily large renditions', async () => {
        const variants = [
            {url:'https://video.twimg.com/1080x1920/large.mp4',bitrate:8000},
            {url:'https://video.twimg.com/360x640/fit-low.mp4',bitrate:1000},
            {url:'https://video.twimg.com/360x640/fit-high.mp4',bitrate:2000},
            {url:'https://video.twimg.com/180x320/small.mp4',bitrate:500}
        ];
        assert.match(MediaSize.gifVariant(variants, 640).url, /fit-high/);
        assert.match(MediaSize.gifVariant(variants, 960).url, /large/);
        assert.equal(MediaSize.gifVariant([{url:'unknown.mp4',bitrate:3}],640).url,'unknown.mp4');
    });
    await check('MP4 choices deduplicate URLs, keep up to three sizes and use exact HEAD lengths', async () => {
        const variants = [1,2,3,4,5].map(n => ({ content_type: 'video/mp4', bitrate: n * 1000000, url: `v${n}.mp4` }));
        variants.push(variants[0], { content_type: 'application/x-mpegURL', url: 'ignored.m3u8' });
        const probed = [];
        sandbox.fetch = async (url, options) => {
            assert.equal(options.method, 'HEAD'); probed.push(url);
            return new Response(null, { headers: { 'content-length': String(Number(url[1]) * 10485760) } });
        };
        const choices = await MediaSize.videoChoices(variants, 60);
        assert.equal(probed.length, 3);
        assert.deepEqual(Array.from(choices, c => c.url), ['v5.mp4', 'v3.mp4', 'v1.mp4']);
        assert.equal(choices[0].bytes, 52428800); assert.equal(choices[0].estimated, false);
    });
    await check('MP4 size estimation falls back to bitrate and handles missing metadata honestly', async () => {
        sandbox.fetch = async () => { throw new Error('HEAD blocked'); };
        const variants = [{ content_type: 'video/mp4', bitrate: 8000000, url: 'video.mp4' }];
        const [choice] = await MediaSize.videoChoices(variants, 20);
        assert.equal(choice.bytes, 21000000); assert.equal(choice.estimated, true);
        assert.match(MediaSize.format(choice.bytes), /≈/);
        const [unknown] = await MediaSize.videoChoices(variants, NaN);
        assert.equal(unknown.bytes, null);
        assert.match(MediaSize.format(unknown.bytes), /Unknown/);
    });
    await check('selected MP4 URL, filename and size are retained across download retries', async () => {
        let dialogs = 0, attempts = 0, successes = 0;
        sandbox.fetch = async url => new Response(null, { headers: { 'content-length': url === 'large.mp4' ? '20971520' : '5242880' } });
        sandbox.GM_download = task => {
            assert.equal(task.url, 'small.mp4'); assert.equal(task.name, 'chosen-small.mp4');
            if (++attempts === 1) task.onerror(new Error('Retry')); else task.onload();
        };
        await new DownloadQueue().start({ url: 'large.mp4', name: 'large.mp4', videoOptions: {
            variants: [ { content_type: 'video/mp4', bitrate: 2, url: 'large.mp4' }, { content_type: 'video/mp4', bitrate: 1, url: 'small.mp4' } ],
            duration: 30, nameForUrl: url => 'chosen-' + url,
            chooseSize: ({ choices, kind }) => { dialogs++; assert.equal(kind, 'MP4'); assert.equal(choices.length, 2); return choices[1].id; }
        }, onload: (bytes, estimated) => { successes++; assert.equal(bytes, 5242880); assert.equal(estimated, false); }, onerror: error => assert.fail(error.message) });
        assert.equal(dialogs, 1); assert.equal(attempts, 2); assert.equal(successes, 1);
    });
    await check('10 MiB MP4 skips picker; over-limit cancellation prevents download', async () => {
        let downloads = 0, cancelled = 0;
        const videoOptions = { variants: [{ content_type: 'video/mp4', url: 'video.mp4', bitrate: 1 }], duration: 1, chooseSize: () => assert.fail('No picker at threshold') };
        sandbox.fetch = async () => new Response(null, { headers: { 'content-length': String(MediaSize.threshold) } });
        sandbox.GM_download = task => { downloads++; task.onload(); };
        await new DownloadQueue().start({ videoOptions, onload() {}, onerror: error => assert.fail(error.message) });
        assert.equal(downloads, 1);
        sandbox.fetch = async () => new Response(null, { headers: { 'content-length': String(MediaSize.threshold + 1) } });
        videoOptions.chooseSize = () => null;
        await new DownloadQueue().start({ videoOptions, oncancel: () => cancelled++, onerror: () => assert.fail(), onload: () => assert.fail() });
        assert.equal(downloads, 1); assert.equal(cancelled, 1);
    });
    await check('video history records the selected size and marks bitrate estimates', async () => {
        const p = await plan([media('video', 'v')]);
        assert.equal(typeof p.tasks[0].videoOptions.chooseSize, 'function');
        await p.tasks[0].onload(5242880, true);
        assert.equal(p.history[0].size, '≈ 5.00 MB');
    });
    await check('size pickers and trim editors never overlap; cancellation releases the next dialog', async () => {
        const ui = new UIManager({});
        const opened = [];
        let finishSize;
        ui.renderMediaSize = () => { opened.push('size'); return new Promise(resolve => { finishSize = resolve; }); };
        ui.renderGifRange = () => { opened.push('trim'); return { start: 1, end: 2 }; };
        const size = ui.chooseMediaSize({});
        const trim = ui.editGifRange({});
        await Promise.resolve();
        assert.deepEqual(opened, ['size']);
        finishSize(null);
        assert.equal(await size, null);
        assert.equal((await trim).start, 1);
        assert.deepEqual(opened, ['size', 'trim']);
    });
    console.log(`${passed} checks passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
