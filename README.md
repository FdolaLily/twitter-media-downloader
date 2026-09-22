# Twitter/X Media Downloader

Download images and videos from Twitter/X with custom filenames and download history.
Animated GIF posts are saved as real `.gif` files. When the media source is MP4,
the script decodes and encodes it locally in the browser.

## Install or update

Copy the complete contents of `script.js` into the existing Tampermonkey script,
save it, and refresh Twitter/X. Replacing the existing script preserves its settings
and download history and avoids duplicate download buttons.

## Short videos to GIF

Use the separate **GIF** button beside the normal download button to convert ordinary
videos up to and including 15 seconds. The normal button still downloads videos as MP4.
The GIF action ignores photos in a mixed-media post and preserves the original media
indexes in filenames. A post without ordinary videos shows a notice.

The decoded video duration is authoritative, including when API metadata is absent or
inaccurate. Videos longer than 15 seconds open a trim editor after the source loads.
Edit directly on the preview timeline. The bright outlined region is kept; the
hatched regions are removed. Drag either handle to resize, or drag the center to move
the entire selection without changing its length. Click the timeline to seek; the white
playhead follows the preview. Arrow keys move a focused handle/selection by 0.1 seconds
(Shift: 1 second). Second inputs remain available and apply on blur or Enter.

Expanding beyond 15 seconds stops the handle at the limit and shows a warning. Shrinking
or moving the selection remains available. Play the selected segment before confirming. Only a valid segment up to 15 seconds can be
converted. Cancel or Escape closes the editor without downloading or recording success.
The already downloaded source is reused for preview and conversion. GIF has no audio. Existing animated GIF downloads keep their separate 120-second limit.

## File size choices

MP4 downloads and GIF conversions offer a size picker when the largest result is
over 10 MB (10 × 1024 × 1024 bytes). The largest option is selected by default.
This threshold opens the picker; it does not force the result below 10 MB.

- MP4: choose up to three available X renditions. Sizes come from a HEAD response
  when available, otherwise from bitrate and duration (marked as approximate).
  A source with two renditions offers two options; a source with only one explicitly
  reports that no smaller version is available. Unknown sizes are not displayed as zero.
  MP4 is downloaded directly, without browser transcoding.
- GIF: Large uses a maximum long edge of 640 px at 15 fps; Medium uses 480 px at
  12 fps; Small uses 320 px at 10 fps. Small sources are never upscaled. Each tier
  is estimated from up to six encoded sample frames from the selected segment.
  A smaller tier keeps the same duration but reduces resolution/frame rate.
- Estimates are marked with ≈ and may differ for changing scenes. If the largest
  GIF was underestimated but actually exceeds 10 MB, the picker still appears before
  downloading, with its actual size. Choosing it reuses the existing encoded output.
- Cancel/Escape prevents the download. Trim and size dialogs are serialized so a
  gallery cannot cover one picker with another. History uses the selected MP4 size
  (marked ≈ if estimated) or actual encoded GIF size.

Native GIF variants are preserved byte for byte; the GIF presets apply to conversions
from video. GIF source/output limits of 100 MiB still apply.

## Upstream integration (0.3.8)

Integrates upstream main (ee4091b) while retaining GIF conversion, trimming and size
selection. Photo and MP4 sources are fetched through GM_xmlhttpRequest and saved
using a local Blob link, as in upstream. Converted GIFs use the same save path after
the size guard. Prepared bytes are reused on save retries; failed source requests
are retried up to three times. Only the final failure is reported. History records
the actual downloaded Blob size, replacing a preliminary MP4 estimate.

Temporary links are removed after each attempt. Successful Blob URLs remain alive
for 60 seconds so the browser can consume them; failed saves release them immediately.
As with upstream, success means the browser download was initiated, not that the
file was verified on disk. Browser download restrictions can still prevent saving.

The upstream shortcut setting is disabled by default and can be enabled in Settings.
The history button also retains upstream's compact layout above the mobile bottom bar.

## Download guard and conversion performance

Version 0.3.7 independently checks the actual GIF blob at the download boundary.
A result over 10 MiB without a size-choice receipt must show a picker before
the browser download can start. If the picker callback is unavailable, the download fails
with a refresh/retry notice instead of silently saving the oversized file.
Already reviewed results avoid a duplicate picker. The fallback retains the trim
range when re-encoding a smaller preset. Native GIFs over 10 MiB require confirmation
to save the original bytes.

Color quantization runs in up to two bundled Web Workers and overlaps video decoding.
Frames are written in their original order with a bounded number of frames in memory.
If workers are blocked or fail, encoding restarts safely on the main thread. No
external worker URL or dependency is downloaded. GIF downloads prefer the smallest
available MP4 rendition that still meets the maximum output dimension; ordinary MP4
downloads retain their existing size choices. The same palette algorithm and output
resolution/frame rate are retained.

A local browser benchmark of the same 11.29-second test segment took 33.622 seconds
in 0.3.6 and 20.602 seconds in 0.3.7 (about 39% less time). Both outputs were
byte-identical: 640 × 360, 170 frames, 15,570,831 bytes. Actual speed depends on the
source, hardware, and worker availability. The reported 15.69 MiB GIF was also used
to verify that the final guard opens a picker and cancellation performs no download.
The original missed-dialog event was not reproduced; the guard covers a skipped
converter picker regardless of why it was skipped.

After updating, refresh existing X tabs. Hover the GIF button to check that its
running version is v0.3.8; updating the installed script alone does not reload code
already running in a tab.

## GIF downloads

- The normal download button converts `animated_gif` media and keeps ordinary videos
  as MP4. The separate GIF button converts ordinary videos, with a trim editor for long sources.
- If a native GIF variant is available, its bytes are preserved.
- MP4-backed animations are converted using the browser video decoder, Canvas, and
  the bundled [gifenc 1.0.3](https://github.com/mattdesl/gifenc) encoder. No conversion
  service, runtime CDN request, extra userscript grant, or external executable is needed.
- The download button shows conversion progress. Hover a failed button for the error.
  Conversion failures do not silently download MP4 or mark the post as completed.
- History records use the generated GIF's size. Download retries reuse the encoded GIF.

The defaults are approximately 15 frames per second, a maximum long edge of 640 pixels,
256 colors per frame, and infinite looping. Smaller sources are not upscaled. The whole animation or selected video segment
is sampled; GIF timing is rounded to 10 ms units. This is a new encoding, not a
byte-for-byte restoration of an uploaded original GIF.

`GifConverter.fps`, `maxSide`, `maxSeconds`, and `maxBytes` can be edited in `script.js`.
The default animated-GIF duration limit is 120 seconds; ordinary video GIF segments are
limited to 15 seconds. The source and encoded output limits are
100 MiB each. Exceeding a limit produces an error instead of truncation. Large animations
can take time and produce much larger files than their MP4 sources.

The bundled gifenc code retains its MIT license and copyright notice in `script.js`.

## Validation

Node.js 20 or newer is required only for the tests; there are no npm dependencies.

```sh
npm run check
npm test
```

Tests cover mixed media routing, GIF filenames and sizes, native GIF preservation,
frame sampling and GIF block timing, trim offsets, timeline handle limits, whole-selection
movement, size thresholds, sample estimates, selected output profiles, cancellation, invalid selections,
conversion errors, duration limits, retries,
temporary URL cleanup, and unchanged ordinary video downloads. Browser APIs and
Tampermonkey downloads are mocked in the automated tests.

A separate browser check converted a real MP4 sample and decoded every output frame:
76 frames, 640 × 360 pixels, 5.05 seconds. The trim editor was also tested with a
20.22-second MP4: selecting 12–14.5 seconds produced 38 frames lasting 2.50 seconds.
The size picker was browser-tested with three MP4 metadata fixtures and a real 15-second
GIF conversion: the small tier produced 320 × 180 pixels, 150 frames, 15 seconds, 4.73 MB.
Actual download behavior on a signed-in
Twitter/X page still needs manual verification after installation.

## 中文说明

将 `script.js` 全部内容替换到原 Tampermonkey 脚本，保存后刷新 X 网页即可。
动图会在本地转换为真正的 GIF，普通视频仍下载为 MP4；按钮会显示转换进度。
默认最高约 15 帧/秒、最长边 640 像素，保留完整时长并循环播放。
超过 120 秒或 100 MiB 限制时显示错误，不会截断动图或改存 MP4。

点击“转 GIF”：普通视频不超过 15 秒时直接转换为无声音 GIF，原下载按钮仍保存 MP4。
超过 15 秒时自动打开裁剪预览窗口。直接在时间轴编辑：亮色框内保留，灰色斜纹区域移除。
拖动两端手柄调整起止时间，拖动中间整体平移片段，点击时间轴查看对应画面。
尝试扩大至超过 15 秒时会显示提示并卡住边界，缩短或整体平移仍可继续操作。
支持方向键微调（Shift 加速）；秒数输入在失焦或按 Enter 时生效。预览后确认转换。片段必须大于 0 秒且不超过 15 秒；取消或 Esc 不会下载。
以实际解码时长为准，接口时长缺失或不准确也能正确判断。源视频仍受 100 MiB 大小限制。

超过 10 MB 时新增文件大小选择，默认选择最大档：
- MP4：根据 X 提供的视频版本显示最多三档，优先读取实际文件大小，无法读取时按码率估算。
- GIF：大档 640 像素 / 15 帧，中档 480 像素 / 12 帧，小档 320 像素 / 10 帧，均指最长边上限，不放大小视频。
- GIF 按所选片段、各档分别抽样编码预估；预估值以 ≈ 标记，实际大小可能不同。
- 小档降低清晰度或帧率，不改变裁剪时长。10 MB 是弹窗阈值，不是强制输出大小上限。
- 原生 GIF 文件仍原样保存；GIF 大小档位用于从视频转换。

0.3.7：增加下载前的实际 GIF 大小检查。超限且未经选档确认时必须弹窗，选择窗口不可用时停止下载。
通过最多两个本地后台线程并行处理颜色、优先使用足够清晰的视频源加快转换；不降低现有分辨率、帧率或调色算法。
更新后请刷新已打开的 X 网页，悬停“转 GIF”按钮可核对当前运行版本 v0.3.8。

0.3.8：整合上游 Blob 下载、默认关闭的快捷键开关和移动端历史按钮适配，保留 GIF 裁剪与选档。下载记录使用实际文件大小；下载失败仅在重试结束后报告。
