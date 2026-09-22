// ==UserScript==
// @name         Twitter/X Media Downloader
// @name:ja      Twitter/X メディアダウンローダー
// @name:zh-CN   Twitter/X 媒体下载器
// @name:zh-TW   Twitter/X 媒體下載器
// @description        Download Twitter/X media; trim videos to GIF and choose file sizes for MP4/GIF over 10 MB.
// @description:ja     Twitter/Xの画像や動画をワンクリックでダウンロード。カスタムファイル名や履歴に対応。
// @description:zh-CN  下载 Twitter/X 图片、视频和 GIF；支持 15 秒裁剪转换，超过 10 MB 的 MP4/GIF 可选择大小档位。
// @description:zh-TW  一鍵下載 Twitter/X 圖片和影片，支援自訂檔名與下載歷史紀錄。
// @author      ShanksSU
// @namespace    https://github.com/ShanksSU/twitter-media-downloader
// @version     0.3.7
// @match       https://twitter.com/*
// @match       https://x.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_download
// @grant       GM_addStyle
// @license     MIT
// ==/UserScript==

class Config {
    static version = '0.3.7';
    static AUTH_TOKEN = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
    static defaultFilename = '{user-name}(@{user-id})_{index}';
    static language = {
        en: { download: 'Download', completed: 'Download Completed', settings: 'Settings', history: 'Download Log', empty: 'No history yet.', unknown_date: 'Unknown Date', saved: 'Saved', dialog: { title: 'Download Settings', save: 'Save', save_history: 'Remember download history', auto_bookmark: 'Auto Bookmark on Download', clear_history: 'Clear All History', clear_confirm: 'Clear all download history?', pattern: 'File Name Pattern', preview: 'Preview:', empty_pattern: 'Pattern cannot be empty.', reset: '(Reset)', custom_mode: '(Custom Mode)', tag_mode: '(Tag Mode)', shortcut: 'Keyboard Shortcut:', tags: { '{user-name}': 'User Name', '{user-id}': 'User ID', '{status-id}': 'Tweet ID', '{date-time}': 'Time (UTC)', '{date-time-local}': 'Time (Local)', '{full-text}': 'Full Text', '{fav-count}': 'Likes', '{file-type}': 'Media Type', '{file-name}': 'Original Filename', '{media-count}': 'Media Count', '{index}': 'Index', '{rt-user-name}': 'RT User Name', '{rt-user-id}': 'RT User ID' } }, table: { thumb: 'Thumb', user: 'User', type: 'Type', size: 'Size', postTime: 'Post Time', downTime: 'Download Time', action: 'Action', go: 'Go', del: 'Delete' } },
        ja: { download: 'ダウンロード', completed: 'ダウンロード完了', settings: '設定', history: 'ダウンロード履歴', empty: '履歴はありません。', unknown_date: '日付不明', saved: '保存しました', dialog: { title: 'ダウンロード設定', save: '保存', save_history: 'ダウンロード履歴を保存する', auto_bookmark: 'ダウンロード時に自動ブックマーク', clear_history: '履歴をクリア', clear_confirm: 'ダウンロード履歴を削除する？', pattern: 'ファイル名パターン', preview: 'プレビュー:', empty_pattern: 'パターンは空にできません。', reset: '(リセット)', custom_mode: '(カスタム)', tag_mode: '(タグモード)', shortcut: 'ショートカットキー:', tags: { '{user-name}': 'ユーザー名', '{user-id}': 'ユーザーID', '{status-id}': 'ツイートID', '{date-time}': '時間 (UTC)', '{date-time-local}': '時間 (ローカル)', '{full-text}': 'ツイート本文', '{fav-count}': 'いいね数', '{file-type}': 'メディア種類', '{file-name}': '元のファイル名', '{media-count}': 'メディア数', '{index}': 'インデックス', '{rt-user-name}': 'RT ユーザー名', '{rt-user-id}': 'RT ユーザーID' } }, table: { thumb: 'サムネ', user: 'ユーザー', type: '種類', size: 'サイズ', postTime: '投稿時間', downTime: '保存時間', action: 'アクション', go: '開く', del: '削除' } },
        zh: { download: '下载', completed: '下载完成', settings: '设置', history: '下载记录', empty: '暂无记录。', unknown_date: '未知时间', saved: '已保存', dialog: { title: '下载设置', save: '保存', save_history: '保存下载记录', auto_bookmark: '下载时自动加入书签', clear_history: '(清除)', clear_confirm: '确认要清除下载记录？', pattern: '文件名格式', preview: '预览:', empty_pattern: '文件名格式不能为空。', reset: '(重置)', custom_mode: '(自订模式)', tag_mode: '(标签模式)', shortcut: '快捷键设定:', tags: { '{user-name}': '用户名称', '{user-id}': '用户账号', '{status-id}': '推文 ID', '{date-time}': '时间 (UTC)', '{date-time-local}': '时间 (本地)', '{full-text}': '推文內文', '{fav-count}': '点赞数', '{file-type}': '媒体类型', '{file-name}': '原始文件名', '{media-count}': '媒体总数', '{index}': '序号', '{rt-user-name}': '转帖者名称', '{rt-user-id}': '转帖者账号' } }, table: { thumb: '缩图', user: '用户', type: '类型', size: '大小', postTime: '贴文时间', downTime: '下载时间', action: '动作', go: '前往', del: '删除' } },
        'zh-Hant': { download: '下載', completed: '下載完成', settings: '設置', history: '下載紀錄', empty: '暫無紀錄。', unknown_date: '未知時間', saved: '已保存', dialog: { title: '下載設置', save: '保存', save_history: '保存下載記錄', auto_bookmark: '下載時自動加入書籤', clear_history: '(清除)', clear_confirm: '確認要清除下載記錄？', pattern: '文件名規則', preview: '預覽:', empty_pattern: '文件名規則不能為空。', reset: '(重置)', custom_mode: '(自訂模式)', tag_mode: '(標籤模式)', shortcut: '快捷鍵設定:', tags: { '{user-name}': '使用者名稱', '{user-id}': '使用者帳號', '{status-id}': '推文 ID', '{date-time}': '時間 (UTC)', '{date-time-local}': '時間 (本地)', '{full-text}': '推文內文', '{fav-count}': '喜歡數量', '{file-type}': '媒體類型', '{file-name}': '原始檔名', '{media-count}': '媒體總數', '{index}': '排序序號', '{rt-user-name}': '轉推者名稱', '{rt-user-id}': '轉推者帳號' } }, table: { thumb: '縮圖', user: '用戶', type: '類型', size: '大小', postTime: '貼文時間', downTime: '下載時間', action: '動作', go: '前往', del: '刪除' } }
    };

    static logIconUri = `data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cpolyline points='10 9 9 9 8 9'%3E%3C/polyline%3E%3C/svg%3E`;

    static media_btn_css = `
        .tmd-down {margin-left: 12px; order: 99; position: relative;}
        button.tmd-gif {align-self: center; border: 1px solid #536471; border-radius: 12px; padding: 3px 7px; background: transparent; color: #536471; font: bold 11px sans-serif; cursor: pointer;}
        button.tmd-gif.tmd-media {right: 38px; top: 2px; background: #15202b; color: #fff;}
        button.tmd-gif.completed {color: #00ba7c; border-color: #00ba7c;}
        button.tmd-gif.failed {color: #f4212e; border-color: #f4212e;}
        .tmd-notice {position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 10001; max-width: 85vw; padding: 12px 18px; border-radius: 8px; background: #15202b; color: #fff; font: 14px sans-serif; box-shadow: 0 2px 12px #0005;}
        .tmd-down:hover > div > div > div > div {color: #FFD700;}
        .tmd-down:hover > div > div > div > div > div {background-color: rgba(255, 215, 0, 0.1);}
        .tmd-down:active > div > div > div > div > div {background-color: rgba(255, 215, 0, 0.2);}
        .tmd-down:hover svg {color: #FFD700;}
        .tmd-down:hover div:first-child:not(:last-child) {background-color: rgba(255, 215, 0, 0.1);}
        .tmd-down:active div:first-child:not(:last-child) {background-color: rgba(255, 215, 0, 0.2);}
        .tmd-down.tmd-media {position: absolute; right: 0;}
        .tmd-down.tmd-media > div {display: flex; border-radius: 99px; margin: 2px;}
        .tmd-down.tmd-media > div > div {display: flex; margin: 6px; color: #fff;}
        .tmd-down.tmd-media:hover > div {background-color: rgba(255,255,255, 0.6);}
        .tmd-down.tmd-media:hover > div > div {color: #FFD700;}
        .tmd-down.tmd-media:not(:hover) > div > div {filter: drop-shadow(0 0 1px #000);}
        .tmd-down g {display: none;}
        .tmd-down.download g.download, .tmd-down.completed g.completed, .tmd-down.exist g.completed, .tmd-down.loading g.loading,.tmd-down.failed g.failed {display: unset;}
        .tmd-down.exist svg {color: #FFD700;}
        .tmd-down.loading[data-tmd-progress]::before {content: attr(data-tmd-progress); position: absolute; bottom: 100%; right: 0; padding: 3px 5px; border-radius: 4px; background: #15202b; color: #fff; font: 11px sans-serif; white-space: nowrap; pointer-events: none;}
        .tmd-down.loading svg {animation: spin 1s linear infinite; color: #FFD700;}
        @keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
        @keyframes tmd-pop-anim {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(1); }
        }
        @keyframes tmd-burst-anim {
            0% {
                box-shadow:
                    0 -10px 0 0 #00ba7c, 7px -7px 0 0 #FFD700,
                    10px 0 0 0 #00ba7c,  7px 7px 0 0 #FFD700,
                    0 10px 0 0 #00ba7c,  -7px 7px 0 0 #FFD700,
                    -10px 0 0 0 #00ba7c, -7px -7px 0 0 #FFD700;
                opacity: 1;
                transform: translate(-50%, -50%) scale(0.5);
            }
            100% {
                box-shadow:
                    0 -25px 0 0 #00ba7c, 18px -18px 0 0 #FFD700,
                    25px 0 0 0 #00ba7c,  18px 18px 0 0 #FFD700,
                    0 25px 0 0 #00ba7c,  -18px 18px 0 0 #FFD700,
                    -25px 0 0 0 #00ba7c, -18px -18px 0 0 #FFD700;
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.2);
            }
        }
        .tmd-down.completed svg {
            color: #00ba7c;
            animation: tmd-pop-anim 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .tmd-down.completed:hover div:first-child:not(:last-child) {
            background-color: rgba(0, 186, 124, 0.2);
        }
        .tmd-down.completed::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: tmd-burst-anim 0.6s ease-out forwards;
            pointer-events: none;
        }
        .tmd-down.tmd-img {position: absolute; right: 0; bottom: 0; display: none !important;}
        .tmd-down.tmd-img > div {display: flex; border-radius: 99px; margin: 2px; background-color: rgba(255,255,255, 0.6);}
        .tmd-down.tmd-img > div > div {display: flex; margin: 6px; color: #fff !important;}
        .tmd-down.tmd-img:not(:hover) > div > div {filter: drop-shadow(0 0 1px #000);}
        .tmd-down.tmd-img:hover > div > div {color: #FFD700;}
        :hover > .tmd-down.tmd-img, .tmd-img.loading, .tmd-img.completed, .tmd-img.exist, .tmd-img.failed {display: block !important;}
        .tweet-detail-action-item {width: 20% !important;}
    `;

    static modal_structure_css = `
        .tmd-modal-wrapper {position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10000; display: flex; justify-content: center; align-items: center;}
        .tmd-modal-dialog {background-color: #fff; border-radius: 10px; width: 850px; max-width: 95vw; display: flex; flex-direction: column; color: #0f1419; font-family: sans-serif; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: background-color 0.2s, color 0.2s;}
        .tmd-modal-header {padding: 15px 20px; border-bottom: 1px solid #eff3f4; display: flex; justify-content: space-between; align-items: center; background: #f7f9f9; transition: background-color 0.2s;}
        .tmd-modal-header-left {display: flex; align-items: center; gap: 10px;}
        .tmd-modal-title {margin: 0; font-size: 18px; font-weight: bold;}
        .tmd-modal-actions {display: flex; align-items: center; gap: 15px;}
        .tmd-icon-btn {cursor: pointer; display: flex; align-items: center; color: #536471; background: none; border: none; padding: 0; transition: color 0.2s;}
        .tmd-icon-btn:hover {color: #0f1419;}
        .tmd-icon-btn.danger {color: #f4212e;}
        .tmd-icon-btn.danger:hover {color: #c50f1a;}
        .tmd-modal-content {overflow-y: auto; max-height: 60vh; padding: 0;}
        .tmd-modal-settings {padding: 20px; overflow-y: auto; max-height: 60vh;}
        .tmd-empty-text {text-align: center; color: #536471; margin: 20px 0; padding: 20px;}
        .tmd-modal-content::-webkit-scrollbar, .tmd-table-wrapper::-webkit-scrollbar {width: 8px; height: 8px;}
        .tmd-modal-content::-webkit-scrollbar-track, .tmd-table-wrapper::-webkit-scrollbar-track {background: #ffffff; border-radius: 4px;}
        .tmd-modal-content::-webkit-scrollbar-thumb, .tmd-table-wrapper::-webkit-scrollbar-thumb {background: #cccccc; border-radius: 4px;}
        .tmd-modal-content::-webkit-scrollbar-thumb:hover, .tmd-table-wrapper::-webkit-scrollbar-thumb:hover {background: #b3b3b3;}
        select.tmd-lang-select { background: #fff; color: #0f1419; border: 1px solid #cfd9de; border-radius: 4px; padding: 4px; font-size: 13px; outline: none; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .tmd-dark-theme { background-color: #15202b; color: #fff; border: 1px solid #38444d; box-shadow: 0 4px 12px rgba(255,255,255,0.05); }
        .tmd-dark-theme .tmd-modal-header { background: #1e2732; border-bottom: 1px solid #38444d; }
        .tmd-dark-theme .tmd-icon-btn { color: #8899a6; }
        .tmd-dark-theme .tmd-icon-btn:hover { color: #fff; }
        .tmd-dark-theme .tmd-empty-text { color: #8899a6; }
        .tmd-dark-theme .tmd-table th { background: #1e2732; color: #8899a6; border-bottom: 1px solid #38444d; box-shadow: 0 1px 0 #38444d; }
        .tmd-dark-theme .tmd-table td, .tmd-dark-theme .tmd-log-item { border-bottom: 1px solid #38444d; }
        .tmd-dark-theme .tmd-table tbody tr:hover { background: #1e2732; }
        .tmd-dark-theme .tmd-action-btn { background: #1e2732; border-color: #38444d; color: #fff; }
        .tmd-dark-theme .tmd-action-btn:hover { background: #2c3640; }
        .tmd-dark-theme .tmd-action-btn.del { background: transparent; border-color: #5c1822; color: #f4212e; }
        .tmd-dark-theme .tmd-action-btn.del:hover { background: #311319; }
        .tmd-dark-theme .tmd-textarea { background: #000; border-color: #38444d; color: #fff; }
        .tmd-dark-theme .tmd-tag-btn { background: #1e2732; border-color: #38444d; color: #8899a6; }
        .tmd-dark-theme .tmd-tag-btn:hover { background: #2c3640; color: #1d9bf0; border-color: #1d9bf0; }
        .tmd-dark-theme .tmd-preview-box { background: #1e2732; border-color: #38444d; color: #fff; }
        .tmd-dark-theme select.tmd-lang-select { background: #1e2732; color: #fff; border-color: #38444d; }
        .tmd-dark-theme .tmd-modal-content::-webkit-scrollbar-track, .tmd-dark-theme .tmd-table-wrapper::-webkit-scrollbar-track {background: #15202b;}
        .tmd-dark-theme .tmd-modal-content::-webkit-scrollbar-thumb, .tmd-dark-theme .tmd-table-wrapper::-webkit-scrollbar-thumb {background: #38444d;}
        .tmd-dark-theme .tmd-modal-content::-webkit-scrollbar-thumb:hover, .tmd-dark-theme .tmd-table-wrapper::-webkit-scrollbar-thumb:hover {background: #8899a6;}
    `;

    static history_log_css = `
        .tmd-history-btn {position: fixed; left: 16px; bottom: 16px; color: #000; background: #fff; border: 1px solid #ccc; border-radius: 8px; padding: 4px; display: flex; align-items: center; cursor: pointer; z-index: 9999; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: 0.2s;}
        .tmd-history-btn:hover {background: #f0f0f0;}
        .tmd-history-btn.tmd-dark-theme {background: #15202b; color: #fff; border-color: #38444d;}
        .tmd-history-btn.tmd-dark-theme:hover {background: #1e2732;}
        .tmd-history-btn label {display: inline-flex; align-items: center; margin: 0 8px; cursor: pointer; font-family: monospace; font-size: 14px;}

        .tmd-table-wrapper { width: 100%; overflow-x: auto; }
        .tmd-table { width: max-content; min-width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; font-family: sans-serif; white-space: nowrap; }
        .tmd-table th, .tmd-table td { border-bottom: 1px solid #eff3f4; vertical-align: middle; }

        .tmd-table td {
            padding: 10px 15px;
            max-width: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .tmd-table td:last-child { max-width: none; overflow: visible; }
        .tmd-table th { background: #f7f9f9; color: #536471; position: sticky; top: 0; z-index: 10; font-weight: bold; box-shadow: 0 1px 0 #eff3f4; padding: 0; }
        .tmd-table th:nth-child(1) .tmd-th-inner { width: 65px; }
        .tmd-table th:nth-child(2) .tmd-th-inner { width: 140px; }
        .tmd-table th:nth-child(3) .tmd-th-inner { width: 70px; }
        .tmd-table th:nth-child(4) .tmd-th-inner { width: 90px; }
        .tmd-table th:nth-child(5) .tmd-th-inner { width: 130px; }
        .tmd-table th:nth-child(6) .tmd-th-inner { width: 130px; }
        .tmd-table th:nth-child(7) .tmd-th-inner { width: 120px; resize: none; }

        .tmd-th-inner { resize: horizontal; overflow: hidden; padding: 10px 15px; min-width: 40px; display: block; box-sizing: border-box; }
        .tmd-table tbody tr:hover { background: #f7f9f9; }
        .tmd-thumb { width: 44px; height: 44px; object-fit: cover; border-radius: 6px; background: #eee; display: block; }
        .tmd-action-btn { background: #eff3f4; border: 1px solid #cfd9de; padding: 6px 12px; border-radius: 99px; cursor: pointer; color: #0f1419; font-size: 12px; margin-right: 6px; font-weight: bold; transition: 0.2s; }
        .tmd-action-btn:hover { background: #e1e8ed; }
        .tmd-action-btn.del { color: #f4212e; border-color: #fcaeb4; background: #fff; }
        .tmd-action-btn.del:hover { background: #fce8e8; }
    `;

    static settings_form_css = `
        .tmd-checkbox-label {display: flex; align-items: center; margin-bottom: 20px; cursor: pointer; font-size: 15px;}
        .tmd-checkbox-label input {margin-right: 10px; cursor: pointer; width: 16px; height: 16px;}
        .tmd-pattern-header {display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px;}
        .tmd-pattern-label {font-weight: bold; font-size: 15px;}
        .tmd-modal-actions {display: flex; gap: 10px;}
        .tmd-btn-reset {cursor: pointer; color: #1d9bf0; font-size: 13px; border: none; background: none; padding: 0;}
        .tmd-btn-reset:hover {text-decoration: underline;}
        .tmd-textarea {width: 100%; height: 80px; box-sizing: border-box; padding: 10px; border: 1px solid #cfd9de; border-radius: 4px; font-family: monospace; resize: vertical; font-size: 14px; color: #fff; background-color: #15202b;}
        .tmd-textarea:focus {outline: none; border-color: #1d9bf0;}
        .tmd-preview-box {margin-top: 10px; padding: 12px; background: #f7f9f9; border: 1px solid #eff3f4; border-radius: 4px; font-family: monospace; font-size: 13px; color: #0f1419; word-break: break-all;}
        .tmd-preview-error {color: #f4212e; font-size: 13px; margin-top: 8px; display: none;}
        .tmd-btn-save {margin-top: 20px; padding: 8px 24px; background: #1d9bf0; color: #fff; border: none; border-radius: 9999px; cursor: pointer; font-weight: bold; font-size: 15px; display: block; margin-left: auto; text-align: center; transition: background 0.2s;}
        .tmd-btn-save:hover:not(:disabled) {background: #1a8cd8;}
        .tmd-btn-save:disabled {background: #8ecdf8; cursor: not-allowed;}
        .tmd-btn-save.saved {background: #00ba7c; cursor: default;}
        .tmd-active-tags-box { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; background: #f7f9f9; border: 1px solid #eff3f4; border-radius: 6px; min-height: 52px; margin-bottom: 12px; transition: 0.2s; }
        .tmd-active-tag { display: flex; align-items: center; background: #fff; border: 1px solid #cfd9de; border-radius: 99px; padding: 4px 10px; font-size: 13px; font-weight: bold; cursor: grab; box-shadow: 0 1px 3px rgba(0,0,0,0.05); user-select: none; transition: 0.2s; }
        .tmd-active-tag.dragging { opacity: 0.3; cursor: grabbing; border-color: #1d9bf0; }
        .tmd-drag-handle { margin-right: 6px; color: #8899a6; display: flex; align-items: center; }
        .tmd-tag-close { margin-left: 6px; cursor: pointer; color: #8899a6; display: flex; align-items: center; border-radius: 50%; padding: 2px; }
        .tmd-tag-close:hover { background: #eff3f4; color: #f4212e; }
        .tmd-available-tags-box { display: flex; flex-wrap: wrap; gap: 8px; }
        .tmd-available-tag { background: #50e3c2; color: #000; padding: 6px 12px; border-radius: 99px; font-size: 13px; font-weight: bold; cursor: pointer; transition: 0.2s; user-select: none; }
        .tmd-available-tag:hover { filter: brightness(0.9); }
        .tmd-tag-container { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .tmd-tag-btn { background: #eff3f4; border: 1px solid #cfd9de; border-radius: 4px; padding: 4px 8px; font-family: monospace; font-size: 12px; color: #536471; cursor: pointer; transition: 0.2s; }
        .tmd-tag-btn:hover { background: #e1e8ed; color: #1d9bf0; border-color: #1d9bf0; }
        .tmd-dark-theme .tmd-active-tags-box { background: #15202b; border-color: #38444d; }
        .tmd-dark-theme .tmd-active-tag { background: #1e2732; border-color: #38444d; color: #fff; }
        .tmd-dark-theme .tmd-tag-close:hover { background: #2c3640; }
        .tmd-dark-theme .tmd-available-tag { background: #2c9a82; color: #fff; }
        .tmd-dark-theme .tmd-preview-box { background: #1e2732; border-color: #38444d; color: #fff; }
        .tmd-dark-theme .tmd-textarea { background: #000; border-color: #38444d; color: #fff; }
        .tmd-dark-theme .tmd-tag-btn { background: #1e2732; border-color: #38444d; color: #8899a6; }
        .tmd-dark-theme .tmd-tag-btn:hover { background: #2c3640; color: #1d9bf0; border-color: #1d9bf0; }
    `;

    static svg = `
        <g class="download">
            <path d="M7 11l5 5 5-5M12 4v12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        <g class="completed">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <polyline points="8 11 11 14 17 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <g class="loading">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
            <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        </g>
        <g class="failed">
            <circle cx="12" cy="12" r="11" fill="#f33" stroke="currentColor" stroke-width="2" opacity="0.8"/>
            <path d="M14.5 7.5l-5 9M9.5 7.5l5 9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        </g>
    `;

    static icon_svg = {
        back: `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
        settings: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        clear: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
        close: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        sun: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
        moon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
    };
}


class Utils {
    static getCookie(name) {
        let cookies = {};
        document.cookie.split(';').filter(n => n.includes('=')).forEach(n => {
            n.replace(/^([^=]+)=(.+)$/, (_, key, value) => { cookies[key.trim()] = value.trim(); });
        });
        return name ? cookies[name] : cookies;
    }

    static formatDate(i, o, tz) {
        let d = new Date(i);
        if (tz) d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        let m = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        let v = {
            YYYY: d.getUTCFullYear().toString(), YY: d.getUTCFullYear().toString(),
            MM: d.getUTCMonth() + 1, MMM: m[d.getUTCMonth()], DD: d.getUTCDate(),
            hh: d.getUTCHours(), mm: d.getUTCMinutes(), ss: d.getUTCSeconds(),
            h2: d.getUTCHours() % 12, ap: d.getUTCHours() < 12 ? 'AM' : 'PM'
        };
        return o.replace(/(YY(YY)?|MMM?|DD|hh|mm|ss|h2|ap)/g, n => ('0' + v[n]).slice(-n.length));
    }

    static getInvalidChars() {
        return {
            "\n": "　", "\t": "　", "\\": "⧹", "/": "⧸", "|": "｜", ":": "꞉", "*": "＊", "?": "？", '"': '″', "<": "＜", ">": "＞", '\u200b': '', '\u200c': '', '\u200d': '', '\u2060': '', '\ufeff': '', '🔞': ''
        };
    }
}


class StorageManager {
    constructor() {
        this.history = [];
        this.saveHistoryFlag = true;
        this.autoBookmarkFlag = false;
        this.filenamePattern = Config.defaultFilename;
        this.shortcutKey = 'D';
        this.theme = 'light';
        this.lang = 'auto';
    }

    async init() {
        let rawHistory = await GM_getValue('download_history', []);
        this.history = rawHistory.map(item => typeof item === 'string' ? { id: item, time: null } : item);
        this.saveHistoryFlag = await GM_getValue('save_history', true);
        this.autoBookmarkFlag = await GM_getValue('auto_bookmark', false);
        this.filenamePattern = await GM_getValue('filename', Config.defaultFilename);
        this.shortcutKey = await GM_getValue('shortcut_key', 'D');
        this.theme = await GM_getValue('tmd_theme', 'light');
        this.lang = await GM_getValue('tmd_lang', 'auto');
    }

    async setSetting(key, value) {
        await GM_setValue(key, value);
        if (key === 'save_history') this.saveHistoryFlag = value;
        if (key === 'auto_bookmark') this.autoBookmarkFlag = value;
        if (key === 'filename') this.filenamePattern = value;
        if (key === 'shortcut_key') this.shortcutKey = value;
        if (key === 'tmd_theme') this.theme = value;
        if (key === 'tmd_lang') this.lang = value;
    }

    async addHistory(infoObj) {
        if (infoObj.id && !this.isDownloaded(infoObj.id)) {
            this.history.push({ ...infoObj, time: Date.now() });
            await GM_setValue('download_history', this.history);
        }
    }

    isDownloaded(statusId) {
        return this.history.some(item => item.id === statusId);
    }

    async clearHistory() {
        this.history = [];
        await GM_setValue('download_history', []);
    }

    async removeHistory(id) {
        this.history = this.history.filter(item => item.id !== id);
        await GM_setValue('download_history', this.history);
    }
}


class TwitterAPI {
    static async fetchTweetJson(status_id) {
        const cookies = Utils.getCookie();
        let url = encodeURI(`https://${location.hostname}/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId?variables=${JSON.stringify({
            tweetId: status_id,
            with_rux_injections: false,
            includePromotedContent: true,
            withCommunity: true,
            withQuickPromoteEligibilityTweetFields: true,
            withBirdwatchNotes: true,
            withVoice: true,
            withV2Timeline: true
        })}&features=${JSON.stringify({
            "articles_preview_enabled": true,
            "c9s_tweet_anatomy_moderator_badge_enabled": true,
            "communities_web_enable_tweet_community_results_fetch": false,
            "creator_subscriptions_quote_tweet_preview_enabled": false,
            "creator_subscriptions_tweet_preview_api_enabled": false,
            "freedom_of_speech_not_reach_fetch_enabled": true,
            "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
            "longform_notetweets_consumption_enabled": false,
            "longform_notetweets_inline_media_enabled": true,
            "longform_notetweets_rich_text_read_enabled": false,
            "premium_content_api_read_enabled": false,
            "profile_label_improvements_pcf_label_in_post_enabled": true,
            "responsive_web_edit_tweet_api_enabled": false,
            "responsive_web_enhance_cards_enabled": false,
            "responsive_web_graphql_exclude_directive_enabled": false,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
            "responsive_web_graphql_timeline_navigation_enabled": false,
            "responsive_web_grok_analysis_button_from_backend": false,
            "responsive_web_grok_analyze_button_fetch_trends_enabled": false,
            "responsive_web_grok_analyze_post_followups_enabled": false,
            "responsive_web_grok_image_annotation_enabled": false,
            "responsive_web_grok_share_attachment_enabled": false,
            "responsive_web_grok_show_grok_translated_post": false,
            "responsive_web_jetfuel_frame": false,
            "responsive_web_media_download_video_enabled": false,
            "responsive_web_twitter_article_tweet_consumption_enabled": true,
            "rweb_tipjar_consumption_enabled": true,
            "rweb_video_screen_enabled": false,
            "standardized_nudges_misinfo": true,
            "tweet_awards_web_tipping_enabled": false,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
            "tweetypie_unmention_optimization_enabled": false,
            "verified_phone_label_enabled": false,
            "view_counts_everywhere_api_enabled": true
        })}`);

        let headers = {
            'authorization': Config.AUTH_TOKEN,
            'x-twitter-active-user': 'yes',
            'x-twitter-client-language': cookies.lang || 'en'
        };

        if (cookies.ct0) headers['x-csrf-token'] = cookies.ct0;
        if (cookies.gt) headers['x-guest-token'] = cookies.gt;

        let res = await fetch(url, { headers });
        if (!res.ok) throw new Error("API Fetch Failed");

        let tweet_detail = await res.json();
        return tweet_detail.data?.tweetResult?.result?.tweet || tweet_detail.data?.tweetResult?.result;
    }
}


/* Bundled gifenc 1.0.3 — https://github.com/mattdesl/gifenc
The MIT License (MIT)
Copyright (c) 2017 Matt DesLauriers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.


*/
const createGifenc = () => {
const module = { exports: {} };
const exports = module.exports;
var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// src/index.js
__markAsModule(exports);
__export(exports, {
  GIFEncoder: () => GIFEncoder,
  applyPalette: () => applyPalette,
  default: () => src_default,
  nearestColor: () => nearestColor,
  nearestColorIndex: () => nearestColorIndex,
  nearestColorIndexWithDistance: () => nearestColorIndexWithDistance,
  prequantize: () => prequantize,
  quantize: () => quantize,
  snapColorsToPalette: () => snapColorsToPalette
});

// src/constants.js
var constants_default = {
  signature: "GIF",
  version: "89a",
  trailer: 59,
  extensionIntroducer: 33,
  applicationExtensionLabel: 255,
  graphicControlExtensionLabel: 249,
  imageSeparator: 44,
  signatureSize: 3,
  versionSize: 3,
  globalColorTableFlagMask: 128,
  colorResolutionMask: 112,
  sortFlagMask: 8,
  globalColorTableSizeMask: 7,
  applicationIdentifierSize: 8,
  applicationAuthCodeSize: 3,
  disposalMethodMask: 28,
  userInputFlagMask: 2,
  transparentColorFlagMask: 1,
  localColorTableFlagMask: 128,
  interlaceFlagMask: 64,
  idSortFlagMask: 32,
  localColorTableSizeMask: 7
};

// src/stream.js
function createStream(initialCapacity = 256) {
  let cursor = 0;
  let contents = new Uint8Array(initialCapacity);
  return {
    get buffer() {
      return contents.buffer;
    },
    reset() {
      cursor = 0;
    },
    bytesView() {
      return contents.subarray(0, cursor);
    },
    bytes() {
      return contents.slice(0, cursor);
    },
    writeByte(byte) {
      expand(cursor + 1);
      contents[cursor] = byte;
      cursor++;
    },
    writeBytes(data, offset = 0, byteLength = data.length) {
      expand(cursor + byteLength);
      for (let i = 0; i < byteLength; i++) {
        contents[cursor++] = data[i + offset];
      }
    },
    writeBytesView(data, offset = 0, byteLength = data.byteLength) {
      expand(cursor + byteLength);
      contents.set(data.subarray(offset, offset + byteLength), cursor);
      cursor += byteLength;
    }
  };
  function expand(newCapacity) {
    var prevCapacity = contents.length;
    if (prevCapacity >= newCapacity)
      return;
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
    if (prevCapacity != 0)
      newCapacity = Math.max(newCapacity, 256);
    const oldContents = contents;
    contents = new Uint8Array(newCapacity);
    if (cursor > 0)
      contents.set(oldContents.subarray(0, cursor), 0);
  }
}

// src/lzwEncode.js
var BITS = 12;
var DEFAULT_HSIZE = 5003;
var MASKS = [
  0,
  1,
  3,
  7,
  15,
  31,
  63,
  127,
  255,
  511,
  1023,
  2047,
  4095,
  8191,
  16383,
  32767,
  65535
];
function lzwEncode(width, height, pixels, colorDepth, outStream = createStream(512), accum = new Uint8Array(256), htab = new Int32Array(DEFAULT_HSIZE), codetab = new Int32Array(DEFAULT_HSIZE)) {
  const hsize = htab.length;
  const initCodeSize = Math.max(2, colorDepth);
  accum.fill(0);
  codetab.fill(0);
  htab.fill(-1);
  let cur_accum = 0;
  let cur_bits = 0;
  const init_bits = initCodeSize + 1;
  const g_init_bits = init_bits;
  let clear_flg = false;
  let n_bits = g_init_bits;
  let maxcode = (1 << n_bits) - 1;
  const ClearCode = 1 << init_bits - 1;
  const EOFCode = ClearCode + 1;
  let free_ent = ClearCode + 2;
  let a_count = 0;
  let ent = pixels[0];
  let hshift = 0;
  for (let fcode = hsize; fcode < 65536; fcode *= 2) {
    ++hshift;
  }
  hshift = 8 - hshift;
  outStream.writeByte(initCodeSize);
  output(ClearCode);
  const length = pixels.length;
  for (let idx = 1; idx < length; idx++) {
    next_block: {
      const c = pixels[idx];
      const fcode = (c << BITS) + ent;
      let i = c << hshift ^ ent;
      if (htab[i] === fcode) {
        ent = codetab[i];
        break next_block;
      }
      const disp = i === 0 ? 1 : hsize - i;
      while (htab[i] >= 0) {
        i -= disp;
        if (i < 0)
          i += hsize;
        if (htab[i] === fcode) {
          ent = codetab[i];
          break next_block;
        }
      }
      output(ent);
      ent = c;
      if (free_ent < 1 << BITS) {
        codetab[i] = free_ent++;
        htab[i] = fcode;
      } else {
        htab.fill(-1);
        free_ent = ClearCode + 2;
        clear_flg = true;
        output(ClearCode);
      }
    }
  }
  output(ent);
  output(EOFCode);
  outStream.writeByte(0);
  return outStream.bytesView();
  function output(code) {
    cur_accum &= MASKS[cur_bits];
    if (cur_bits > 0)
      cur_accum |= code << cur_bits;
    else
      cur_accum = code;
    cur_bits += n_bits;
    while (cur_bits >= 8) {
      accum[a_count++] = cur_accum & 255;
      if (a_count >= 254) {
        outStream.writeByte(a_count);
        outStream.writeBytesView(accum, 0, a_count);
        a_count = 0;
      }
      cur_accum >>= 8;
      cur_bits -= 8;
    }
    if (free_ent > maxcode || clear_flg) {
      if (clear_flg) {
        n_bits = g_init_bits;
        maxcode = (1 << n_bits) - 1;
        clear_flg = false;
      } else {
        ++n_bits;
        maxcode = n_bits === BITS ? 1 << n_bits : (1 << n_bits) - 1;
      }
    }
    if (code == EOFCode) {
      while (cur_bits > 0) {
        accum[a_count++] = cur_accum & 255;
        if (a_count >= 254) {
          outStream.writeByte(a_count);
          outStream.writeBytesView(accum, 0, a_count);
          a_count = 0;
        }
        cur_accum >>= 8;
        cur_bits -= 8;
      }
      if (a_count > 0) {
        outStream.writeByte(a_count);
        outStream.writeBytesView(accum, 0, a_count);
        a_count = 0;
      }
    }
  }
}
var lzwEncode_default = lzwEncode;

// src/rgb-packing.js
function rgb888_to_rgb565(r, g, b) {
  return r << 8 & 63488 | g << 2 & 992 | b >> 3;
}
function rgba8888_to_rgba4444(r, g, b, a) {
  return r >> 4 | g & 240 | (b & 240) << 4 | (a & 240) << 8;
}
function rgb888_to_rgb444(r, g, b) {
  return r >> 4 << 8 | g & 240 | b >> 4;
}

// src/pnnquant2.js
function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}
function sqr(value) {
  return value * value;
}
function find_nn(bins, idx, hasAlpha) {
  var nn = 0;
  var err = 1e100;
  const bin1 = bins[idx];
  const n1 = bin1.cnt;
  const wa = bin1.ac;
  const wr = bin1.rc;
  const wg = bin1.gc;
  const wb = bin1.bc;
  for (var i = bin1.fw; i != 0; i = bins[i].fw) {
    const bin = bins[i];
    const n2 = bin.cnt;
    const nerr2 = n1 * n2 / (n1 + n2);
    if (nerr2 >= err)
      continue;
    var nerr = 0;
    if (hasAlpha) {
      nerr += nerr2 * sqr(bin.ac - wa);
      if (nerr >= err)
        continue;
    }
    nerr += nerr2 * sqr(bin.rc - wr);
    if (nerr >= err)
      continue;
    nerr += nerr2 * sqr(bin.gc - wg);
    if (nerr >= err)
      continue;
    nerr += nerr2 * sqr(bin.bc - wb);
    if (nerr >= err)
      continue;
    err = nerr;
    nn = i;
  }
  bin1.err = err;
  bin1.nn = nn;
}
function create_bin() {
  return {
    ac: 0,
    rc: 0,
    gc: 0,
    bc: 0,
    cnt: 0,
    nn: 0,
    fw: 0,
    bk: 0,
    tm: 0,
    mtm: 0,
    err: 0
  };
}
function create_bin_list(data, format) {
  const bincount = format === "rgb444" ? 4096 : 65536;
  const bins = new Array(bincount);
  const size = data.length;
  if (format === "rgba4444") {
    for (let i = 0; i < size; ++i) {
      const color = data[i];
      const a = color >> 24 & 255;
      const b = color >> 16 & 255;
      const g = color >> 8 & 255;
      const r = color & 255;
      const index = rgba8888_to_rgba4444(r, g, b, a);
      let bin = index in bins ? bins[index] : bins[index] = create_bin();
      bin.rc += r;
      bin.gc += g;
      bin.bc += b;
      bin.ac += a;
      bin.cnt++;
    }
  } else if (format === "rgb444") {
    for (let i = 0; i < size; ++i) {
      const color = data[i];
      const b = color >> 16 & 255;
      const g = color >> 8 & 255;
      const r = color & 255;
      const index = rgb888_to_rgb444(r, g, b);
      let bin = index in bins ? bins[index] : bins[index] = create_bin();
      bin.rc += r;
      bin.gc += g;
      bin.bc += b;
      bin.cnt++;
    }
  } else {
    for (let i = 0; i < size; ++i) {
      const color = data[i];
      const b = color >> 16 & 255;
      const g = color >> 8 & 255;
      const r = color & 255;
      const index = rgb888_to_rgb565(r, g, b);
      let bin = index in bins ? bins[index] : bins[index] = create_bin();
      bin.rc += r;
      bin.gc += g;
      bin.bc += b;
      bin.cnt++;
    }
  }
  return bins;
}
function quantize(rgba, maxColors, opts = {}) {
  const {
    format = "rgb565",
    clearAlpha = true,
    clearAlphaColor = 0,
    clearAlphaThreshold = 0,
    oneBitAlpha = false
  } = opts;
  if (!rgba || !rgba.buffer) {
    throw new Error("quantize() expected RGBA Uint8Array data");
  }
  if (!(rgba instanceof Uint8Array) && !(rgba instanceof Uint8ClampedArray)) {
    throw new Error("quantize() expected RGBA Uint8Array data");
  }
  const data = new Uint32Array(rgba.buffer);
  let useSqrt = opts.useSqrt !== false;
  const hasAlpha = format === "rgba4444";
  const bins = create_bin_list(data, format);
  const bincount = bins.length;
  const bincountMinusOne = bincount - 1;
  const heap = new Uint32Array(bincount + 1);
  var maxbins = 0;
  for (var i = 0; i < bincount; ++i) {
    const bin = bins[i];
    if (bin != null) {
      var d = 1 / bin.cnt;
      if (hasAlpha)
        bin.ac *= d;
      bin.rc *= d;
      bin.gc *= d;
      bin.bc *= d;
      bins[maxbins++] = bin;
    }
  }
  if (sqr(maxColors) / maxbins < 0.022) {
    useSqrt = false;
  }
  var i = 0;
  for (; i < maxbins - 1; ++i) {
    bins[i].fw = i + 1;
    bins[i + 1].bk = i;
    if (useSqrt)
      bins[i].cnt = Math.sqrt(bins[i].cnt);
  }
  if (useSqrt)
    bins[i].cnt = Math.sqrt(bins[i].cnt);
  var h, l, l2;
  for (i = 0; i < maxbins; ++i) {
    find_nn(bins, i, false);
    var err = bins[i].err;
    for (l = ++heap[0]; l > 1; l = l2) {
      l2 = l >> 1;
      if (bins[h = heap[l2]].err <= err)
        break;
      heap[l] = h;
    }
    heap[l] = i;
  }
  var extbins = maxbins - maxColors;
  for (i = 0; i < extbins; ) {
    var tb;
    for (; ; ) {
      var b1 = heap[1];
      tb = bins[b1];
      if (tb.tm >= tb.mtm && bins[tb.nn].mtm <= tb.tm)
        break;
      if (tb.mtm == bincountMinusOne)
        b1 = heap[1] = heap[heap[0]--];
      else {
        find_nn(bins, b1, false);
        tb.tm = i;
      }
      var err = bins[b1].err;
      for (l = 1; (l2 = l + l) <= heap[0]; l = l2) {
        if (l2 < heap[0] && bins[heap[l2]].err > bins[heap[l2 + 1]].err)
          l2++;
        if (err <= bins[h = heap[l2]].err)
          break;
        heap[l] = h;
      }
      heap[l] = b1;
    }
    var nb = bins[tb.nn];
    var n1 = tb.cnt;
    var n2 = nb.cnt;
    var d = 1 / (n1 + n2);
    if (hasAlpha)
      tb.ac = d * (n1 * tb.ac + n2 * nb.ac);
    tb.rc = d * (n1 * tb.rc + n2 * nb.rc);
    tb.gc = d * (n1 * tb.gc + n2 * nb.gc);
    tb.bc = d * (n1 * tb.bc + n2 * nb.bc);
    tb.cnt += nb.cnt;
    tb.mtm = ++i;
    bins[nb.bk].fw = nb.fw;
    bins[nb.fw].bk = nb.bk;
    nb.mtm = bincountMinusOne;
  }
  let palette = [];
  var k = 0;
  for (i = 0; ; ++k) {
    let r = clamp(Math.round(bins[i].rc), 0, 255);
    let g = clamp(Math.round(bins[i].gc), 0, 255);
    let b = clamp(Math.round(bins[i].bc), 0, 255);
    let a = 255;
    if (hasAlpha) {
      a = clamp(Math.round(bins[i].ac), 0, 255);
      if (oneBitAlpha) {
        const threshold = typeof oneBitAlpha === "number" ? oneBitAlpha : 127;
        a = a <= threshold ? 0 : 255;
      }
      if (clearAlpha && a <= clearAlphaThreshold) {
        r = g = b = clearAlphaColor;
        a = 0;
      }
    }
    const color = hasAlpha ? [r, g, b, a] : [r, g, b];
    const exists = existsInPalette(palette, color);
    if (!exists)
      palette.push(color);
    if ((i = bins[i].fw) == 0)
      break;
  }
  return palette;
}
function existsInPalette(palette, color) {
  for (let i = 0; i < palette.length; i++) {
    const p = palette[i];
    let matchesRGB = p[0] === color[0] && p[1] === color[1] && p[2] === color[2];
    let matchesAlpha = p.length >= 4 && color.length >= 4 ? p[3] === color[3] : true;
    if (matchesRGB && matchesAlpha)
      return true;
  }
  return false;
}

// src/color.js
function euclideanDistanceSquared(a, b) {
  var sum = 0;
  var n;
  for (n = 0; n < a.length; n++) {
    const dx = a[n] - b[n];
    sum += dx * dx;
  }
  return sum;
}

// src/palettize.js
function roundStep(byte, step) {
  return step > 1 ? Math.round(byte / step) * step : byte;
}
function prequantize(rgba, {roundRGB = 5, roundAlpha = 10, oneBitAlpha = null} = {}) {
  const data = new Uint32Array(rgba.buffer);
  for (let i = 0; i < data.length; i++) {
    const color = data[i];
    let a = color >> 24 & 255;
    let b = color >> 16 & 255;
    let g = color >> 8 & 255;
    let r = color & 255;
    a = roundStep(a, roundAlpha);
    if (oneBitAlpha) {
      const threshold = typeof oneBitAlpha === "number" ? oneBitAlpha : 127;
      a = a <= threshold ? 0 : 255;
    }
    r = roundStep(r, roundRGB);
    g = roundStep(g, roundRGB);
    b = roundStep(b, roundRGB);
    data[i] = a << 24 | b << 16 | g << 8 | r << 0;
  }
}
function applyPalette(rgba, palette, format = "rgb565") {
  if (!rgba || !rgba.buffer) {
    throw new Error("quantize() expected RGBA Uint8Array data");
  }
  if (!(rgba instanceof Uint8Array) && !(rgba instanceof Uint8ClampedArray)) {
    throw new Error("quantize() expected RGBA Uint8Array data");
  }
  if (palette.length > 256) {
    throw new Error("applyPalette() only works with 256 colors or less");
  }
  const data = new Uint32Array(rgba.buffer);
  const length = data.length;
  const bincount = format === "rgb444" ? 4096 : 65536;
  const index = new Uint8Array(length);
  const cache = new Array(bincount);
  const hasAlpha = format === "rgba4444";
  if (format === "rgba4444") {
    for (let i = 0; i < length; i++) {
      const color = data[i];
      const a = color >> 24 & 255;
      const b = color >> 16 & 255;
      const g = color >> 8 & 255;
      const r = color & 255;
      const key = rgba8888_to_rgba4444(r, g, b, a);
      const idx = key in cache ? cache[key] : cache[key] = nearestColorIndexRGBA(r, g, b, a, palette);
      index[i] = idx;
    }
  } else {
    const rgb888_to_key = format === "rgb444" ? rgb888_to_rgb444 : rgb888_to_rgb565;
    for (let i = 0; i < length; i++) {
      const color = data[i];
      const b = color >> 16 & 255;
      const g = color >> 8 & 255;
      const r = color & 255;
      const key = rgb888_to_key(r, g, b);
      const idx = key in cache ? cache[key] : cache[key] = nearestColorIndexRGB(r, g, b, palette);
      index[i] = idx;
    }
  }
  return index;
}
function nearestColorIndexRGBA(r, g, b, a, palette) {
  let k = 0;
  let mindist = 1e100;
  for (let i = 0; i < palette.length; i++) {
    const px2 = palette[i];
    const a2 = px2[3];
    let curdist = sqr2(a2 - a);
    if (curdist > mindist)
      continue;
    const r2 = px2[0];
    curdist += sqr2(r2 - r);
    if (curdist > mindist)
      continue;
    const g2 = px2[1];
    curdist += sqr2(g2 - g);
    if (curdist > mindist)
      continue;
    const b2 = px2[2];
    curdist += sqr2(b2 - b);
    if (curdist > mindist)
      continue;
    mindist = curdist;
    k = i;
  }
  return k;
}
function nearestColorIndexRGB(r, g, b, palette) {
  let k = 0;
  let mindist = 1e100;
  for (let i = 0; i < palette.length; i++) {
    const px2 = palette[i];
    const r2 = px2[0];
    let curdist = sqr2(r2 - r);
    if (curdist > mindist)
      continue;
    const g2 = px2[1];
    curdist += sqr2(g2 - g);
    if (curdist > mindist)
      continue;
    const b2 = px2[2];
    curdist += sqr2(b2 - b);
    if (curdist > mindist)
      continue;
    mindist = curdist;
    k = i;
  }
  return k;
}
function snapColorsToPalette(palette, knownColors, threshold = 5) {
  if (!palette.length || !knownColors.length)
    return;
  const paletteRGB = palette.map((p) => p.slice(0, 3));
  const thresholdSq = threshold * threshold;
  const dim = palette[0].length;
  for (let i = 0; i < knownColors.length; i++) {
    let color = knownColors[i];
    if (color.length < dim) {
      color = [color[0], color[1], color[2], 255];
    } else if (color.length > dim) {
      color = color.slice(0, 3);
    } else {
      color = color.slice();
    }
    const r = nearestColorIndexWithDistance(paletteRGB, color.slice(0, 3), euclideanDistanceSquared);
    const idx = r[0];
    const distanceSq = r[1];
    if (distanceSq > 0 && distanceSq <= thresholdSq) {
      palette[idx] = color;
    }
  }
}
function sqr2(a) {
  return a * a;
}
function nearestColorIndex(colors, pixel, distanceFn = euclideanDistanceSquared) {
  let minDist = Infinity;
  let minDistIndex = -1;
  for (let j = 0; j < colors.length; j++) {
    const paletteColor = colors[j];
    const dist = distanceFn(pixel, paletteColor);
    if (dist < minDist) {
      minDist = dist;
      minDistIndex = j;
    }
  }
  return minDistIndex;
}
function nearestColorIndexWithDistance(colors, pixel, distanceFn = euclideanDistanceSquared) {
  let minDist = Infinity;
  let minDistIndex = -1;
  for (let j = 0; j < colors.length; j++) {
    const paletteColor = colors[j];
    const dist = distanceFn(pixel, paletteColor);
    if (dist < minDist) {
      minDist = dist;
      minDistIndex = j;
    }
  }
  return [minDistIndex, minDist];
}
function nearestColor(colors, pixel, distanceFn = euclideanDistanceSquared) {
  return colors[nearestColorIndex(colors, pixel, distanceFn)];
}

// src/index.js
function GIFEncoder(opt = {}) {
  const {initialCapacity = 4096, auto = true} = opt;
  const stream = createStream(initialCapacity);
  const HSIZE = 5003;
  const accum = new Uint8Array(256);
  const htab = new Int32Array(HSIZE);
  const codetab = new Int32Array(HSIZE);
  let hasInit = false;
  return {
    reset() {
      stream.reset();
      hasInit = false;
    },
    finish() {
      stream.writeByte(constants_default.trailer);
    },
    bytes() {
      return stream.bytes();
    },
    bytesView() {
      return stream.bytesView();
    },
    get buffer() {
      return stream.buffer;
    },
    get stream() {
      return stream;
    },
    writeHeader,
    writeFrame(index, width, height, opts = {}) {
      const {
        transparent = false,
        transparentIndex = 0,
        delay = 0,
        palette = null,
        repeat = 0,
        colorDepth = 8,
        dispose = -1
      } = opts;
      let first = false;
      if (auto) {
        if (!hasInit) {
          first = true;
          writeHeader();
          hasInit = true;
        }
      } else {
        first = Boolean(opts.first);
      }
      width = Math.max(0, Math.floor(width));
      height = Math.max(0, Math.floor(height));
      if (first) {
        if (!palette) {
          throw new Error("First frame must include a { palette } option");
        }
        encodeLogicalScreenDescriptor(stream, width, height, palette, colorDepth);
        encodeColorTable(stream, palette);
        if (repeat >= 0) {
          encodeNetscapeExt(stream, repeat);
        }
      }
      const delayTime = Math.round(delay / 10);
      encodeGraphicControlExt(stream, dispose, delayTime, transparent, transparentIndex);
      const useLocalColorTable = Boolean(palette) && !first;
      encodeImageDescriptor(stream, width, height, useLocalColorTable ? palette : null);
      if (useLocalColorTable)
        encodeColorTable(stream, palette);
      encodePixels(stream, index, width, height, colorDepth, accum, htab, codetab);
    }
  };
  function writeHeader() {
    writeUTFBytes(stream, "GIF89a");
  }
}
function encodeGraphicControlExt(stream, dispose, delay, transparent, transparentIndex) {
  stream.writeByte(33);
  stream.writeByte(249);
  stream.writeByte(4);
  if (transparentIndex < 0) {
    transparentIndex = 0;
    transparent = false;
  }
  var transp, disp;
  if (!transparent) {
    transp = 0;
    disp = 0;
  } else {
    transp = 1;
    disp = 2;
  }
  if (dispose >= 0) {
    disp = dispose & 7;
  }
  disp <<= 2;
  const userInput = 0;
  stream.writeByte(0 | disp | userInput | transp);
  writeUInt16(stream, delay);
  stream.writeByte(transparentIndex || 0);
  stream.writeByte(0);
}
function encodeLogicalScreenDescriptor(stream, width, height, palette, colorDepth = 8) {
  const globalColorTableFlag = 1;
  const sortFlag = 0;
  const globalColorTableSize = colorTableSize(palette.length) - 1;
  const fields = globalColorTableFlag << 7 | colorDepth - 1 << 4 | sortFlag << 3 | globalColorTableSize;
  const backgroundColorIndex = 0;
  const pixelAspectRatio = 0;
  writeUInt16(stream, width);
  writeUInt16(stream, height);
  stream.writeBytes([fields, backgroundColorIndex, pixelAspectRatio]);
}
function encodeNetscapeExt(stream, repeat) {
  stream.writeByte(33);
  stream.writeByte(255);
  stream.writeByte(11);
  writeUTFBytes(stream, "NETSCAPE2.0");
  stream.writeByte(3);
  stream.writeByte(1);
  writeUInt16(stream, repeat);
  stream.writeByte(0);
}
function encodeColorTable(stream, palette) {
  const colorTableLength = 1 << colorTableSize(palette.length);
  for (let i = 0; i < colorTableLength; i++) {
    let color = [0, 0, 0];
    if (i < palette.length) {
      color = palette[i];
    }
    stream.writeByte(color[0]);
    stream.writeByte(color[1]);
    stream.writeByte(color[2]);
  }
}
function encodeImageDescriptor(stream, width, height, localPalette) {
  stream.writeByte(44);
  writeUInt16(stream, 0);
  writeUInt16(stream, 0);
  writeUInt16(stream, width);
  writeUInt16(stream, height);
  if (localPalette) {
    const interlace = 0;
    const sorted = 0;
    const palSize = colorTableSize(localPalette.length) - 1;
    stream.writeByte(128 | interlace | sorted | 0 | palSize);
  } else {
    stream.writeByte(0);
  }
}
function encodePixels(stream, index, width, height, colorDepth = 8, accum, htab, codetab) {
  lzwEncode_default(width, height, index, colorDepth, stream, accum, htab, codetab);
}
function writeUInt16(stream, short) {
  stream.writeByte(short & 255);
  stream.writeByte(short >> 8 & 255);
}
function writeUTFBytes(stream, text) {
  for (var i = 0; i < text.length; i++) {
    stream.writeByte(text.charCodeAt(i));
  }
}
function colorTableSize(length) {
  return Math.max(Math.ceil(Math.log2(length)), 1);
}
var src_default = GIFEncoder;


return module.exports;
};
const TmdGifenc = createGifenc();

// A bounded pipeline overlaps video decoding with color quantization without changing quality.
class GifWorkerPool {
    static async open() {
        if (typeof Worker === 'undefined') return null;
        const pool = new GifWorkerPool();
        const source = `const codec = (${createGifenc.toString()})();
            self.onmessage = ({data}) => {
                try {
                    const rgba = new Uint8Array(data);
                    const palette = codec.quantize(rgba, 256);
                    const pixels = codec.applyPalette(rgba, palette);
                    self.postMessage({ palette, pixels: pixels.buffer }, [pixels.buffer]);
                } catch(error) { self.postMessage({ error: String(error.message || error) }); }
            };
            self.postMessage({ready:true});`;
        pool.url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
        try {
            const count = Math.min(2, Math.max(1, (globalThis.navigator?.hardwareConcurrency || 2) - 1));
            await Promise.all(Array.from({ length: count }, () => pool.addWorker()));
            return pool;
        } catch {
            // CSP and older browsers may disallow blob workers. The main-thread path remains available.
            pool.close();
            return null;
        }
    }

    constructor() { this.slots = []; this.closed = false; }

    static error(message) { return Object.assign(new Error(message), { code: 'GIF_WORKER_ERROR' }); }

    addWorker() {
        return new Promise((resolve, reject) => {
            const worker = new Worker(this.url);
            const slot = { worker, pending: null, ready: false };
            this.slots.push(slot);
            const timer = setTimeout(() => reject(GifWorkerPool.error('GIF worker startup timed out')), 1500);
            slot.cancelReady = () => { clearTimeout(timer); reject(GifWorkerPool.error('GIF worker closed')); };
            worker.onmessage = ({ data }) => {
                if (data.ready) { clearTimeout(timer); slot.ready = true; resolve(); return; }
                const pending = slot.pending;
                if (!pending) return;
                slot.pending = null;
                clearTimeout(pending.timer);
                if (data.error) pending.reject(GifWorkerPool.error(data.error));
                else pending.resolve({ palette: data.palette, pixels: new Uint8Array(data.pixels) });
            };
            worker.onerror = event => {
                slot.failed = true;
                event.preventDefault?.();
                clearTimeout(timer);
                const error = GifWorkerPool.error(event.message || 'GIF worker failed');
                if (!slot.ready) reject(error);
                if (slot.pending) { clearTimeout(slot.pending.timer); slot.pending.reject(error); slot.pending = null; }
            };
        });
    }

    encode(rgba) {
        const slot = this.slots.find(item => !item.pending && !item.failed);
        if (this.closed || !slot) return Promise.reject(GifWorkerPool.error('GIF worker unavailable'));
        const job = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                slot.failed = true;
                slot.pending = null;
                reject(GifWorkerPool.error('GIF worker timed out'));
            }, 30000);
            slot.pending = { resolve, reject, timer };
            const pixels = rgba.byteOffset || rgba.byteLength !== rgba.buffer.byteLength ? rgba.slice() : rgba;
            try { slot.worker.postMessage(pixels.buffer, [pixels.buffer]); }
            catch (error) { clearTimeout(timer); slot.pending = null; reject(GifWorkerPool.error(error.message)); }
        });
        // A later frame can fail before the preceding frame has been flushed.
        job.catch(() => {});
        return job;
    }

    close() {
        this.closed = true;
        for (const slot of this.slots) {
            if (!slot.ready) slot.cancelReady();
            if (slot.pending) { clearTimeout(slot.pending.timer); slot.pending.reject(GifWorkerPool.error('GIF worker closed')); slot.pending = null; }
            slot.worker.terminate();
        }
        if (this.url) { URL.revokeObjectURL(this.url); this.url = null; }
    }
}

class MediaSize {
    static threshold = 10 * 1024 * 1024;
    static approvedGifs = new WeakSet();

    static gifVariant(variants, maxSide) {
        const ranked = [...variants].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
        const sized = ranked.map(variant => {
            const dimensions = variant.url?.match(/\/(\d{2,5})x(\d{2,5})\//);
            return { variant, side: dimensions ? Math.max(Number(dimensions[1]), Number(dimensions[2])) : 0 };
        }).filter(item => item.side >= maxSide).sort((a, b) => a.side - b.side);
        return sized[0]?.variant || ranked[0];
    }

    static format(bytes, estimated = true) {
        if (!Number.isFinite(bytes) || bytes <= 0) return 'Unknown / 无法预估';
        return `${estimated ? '≈ ' : ''}${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    static cancelled() {
        return Object.assign(new Error('Download cancelled / 已取消下载'), { code: 'GIF_CANCELLED' });
    }

    static async choose(choices, chooseSize, kind) {
        if (!chooseSize) throw new Error('Size selection unavailable. Refresh X and retry / 大小选择未就绪，请刷新 X 后重试');
        const id = await chooseSize({ kind, choices });
        if (id == null) throw this.cancelled();
        const chosen = choices.find(choice => choice.id === id);
        if (!chosen) throw new Error('Invalid size option / 无效的大小选项');
        return chosen;
    }

    static async videoChoices(variants, duration) {
        const unique = [...new Map(variants.filter(v => v.content_type === 'video/mp4' && v.url)
            .map(v => [v.url, v])).values()].sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
        // X normally supplies two or three MP4 renditions. Keep high/middle/low if more exist.
        const candidates = unique.length <= 3 ? unique : [unique[0], unique[Math.floor(unique.length / 2)], unique.at(-1)];
        const choices = await Promise.all(candidates.map(async variant => {
            let bytes = null;
            try {
                const response = await fetch(variant.url, { method: 'HEAD', credentials: 'omit', signal: AbortSignal.timeout(8000) });
                const length = Number(response.headers.get('content-length'));
                if (response.ok && Number.isFinite(length) && length > 0) bytes = length;
            } catch { /* Some media servers omit or block HEAD; use bitrate and duration. */ }
            const estimated = bytes == null;
            if (estimated && Number.isFinite(duration) && duration > 0 && variant.bitrate > 0) {
                bytes = Math.ceil(variant.bitrate * duration / 8 * 1.05);
            }
            const resolution = variant.url.match(/\/(\d{2,5})x(\d{2,5})\//);
            const detail = [resolution ? `${resolution[1]} × ${resolution[2]}` : '',
                variant.bitrate > 0 ? `${(variant.bitrate / 1000000).toFixed(2)} Mbps` : 'MP4'].filter(Boolean).join(' · ');
            return { id: variant.url, url: variant.url, bytes, estimated, detail };
        }));
        // Known sizes determine the default largest option; retain bitrate order if unknown.
        if (choices.every(choice => choice.bytes != null)) choices.sort((a, b) => b.bytes - a.bytes);
        return choices;
    }
}

// GIF encoding runs locally; media is never sent to a conversion service.
class GifConverter {
    static outputs = new WeakMap();
    static fps = 15;
    static maxSide = 640;
    static maxSeconds = 120;
    static maxBytes = 100 * 1024 * 1024;
    static tail = Promise.resolve();

    static convert(url, progress, options = {}) {
        const job = this.tail.then(() => this.encode(url, progress, options));
        this.tail = job.catch(() => {});
        return job;
    }

    static waitFor(video, event, action) {
        return new Promise((resolve, reject) => {
            const cleanup = () => {
                clearTimeout(timer);
                video.removeEventListener(event, done);
                video.removeEventListener('error', failed);
            };
            const done = () => { cleanup(); resolve(); };
            const failed = () => { cleanup(); reject(new Error('GIF: video decoding failed / 视频解码失败')); };
            const timer = setTimeout(() => {
                cleanup();
                reject(new Error('GIF: video decoding timed out / 视频解码超时'));
            }, 30000);
            video.addEventListener(event, done, { once: true });
            video.addEventListener('error', failed, { once: true });
            try { action(); } catch (error) { cleanup(); reject(error); }
        });
    }

    static validateDuration(duration, maxSeconds = this.maxSeconds) {
        if (!Number.isFinite(duration) || duration <= 0) {
            throw new Error('GIF: invalid video duration / 无法读取视频时长');
        }
        if (duration > maxSeconds) {
            throw new Error(`GIF: exceeds ${maxSeconds}s conversion limit / 仅支持 ${maxSeconds} 秒以内的视频`);
        }
    }

    static validateRange(range, duration, maxSeconds) {
        if (!range || !Number.isFinite(range.start) || !Number.isFinite(range.end) ||
            range.start < 0 || range.end > duration || range.end <= range.start) {
            throw new Error('GIF: invalid trim range / 裁剪起止时间无效');
        }
        if (range.end - range.start > maxSeconds + 1e-8) {
            this.validateDuration(range.end - range.start, maxSeconds);
        }
    }

    static profiles(video) {
        return [
            { id: 'large', maxSide: this.maxSide, fps: this.fps },
            { id: 'medium', maxSide: Math.min(480, this.maxSide), fps: Math.min(12, this.fps) },
            { id: 'small', maxSide: Math.min(320, this.maxSide), fps: Math.min(10, this.fps) }
        ].map(profile => {
            const scale = Math.min(1, profile.maxSide / Math.max(video.videoWidth, video.videoHeight));
            return { ...profile, width: Math.max(1, Math.round(video.videoWidth * scale)),
                height: Math.max(1, Math.round(video.videoHeight * scale)) };
        }).filter((profile, i, all) => all.findIndex(p => p.width === profile.width && p.height === profile.height && p.fps === profile.fps) === i);
    }

    static sizeChoices(profiles, largestBytes, duration, largestExact = false) {
        const largest = profiles[0];
        const largeFrames = Math.ceil(duration * largest.fps);
        return profiles.map((profile, i) => ({ ...profile,
            bytes: Math.ceil(largestBytes * profile.width * profile.height / (largest.width * largest.height)
                * Math.ceil(duration * profile.fps) / largeFrames),
            estimated: i !== 0 || !largestExact,
            detail: `${profile.width} × ${profile.height} · ${profile.fps} fps`
        }));
    }

    static async captureFrame(video, canvas, context, time) {
        if (Math.abs(video.currentTime - time) > 0.000001) {
            await this.waitFor(video, 'seeked', () => { video.currentTime = time; });
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
        // Use this userscript realm's typed-array constructor (Tampermonkey sandbox).
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }

    static async writeFrame(video, canvas, context, encoder, time, delay, pool = null) {
        const rgba = await this.captureFrame(video, canvas, context, time);
        let palette, pixels;
        if (pool) ({ palette, pixels } = await pool.encode(rgba));
        else { palette = TmdGifenc.quantize(rgba, 256); pixels = TmdGifenc.applyPalette(rgba, palette); }
        encoder.writeFrame(pixels, canvas.width, canvas.height, { palette, delay, repeat: 0 });
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    static async encode(url, progress = () => {}, options = {}) {
        progress('GIF ↓');
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 90000);
        let source;
        try {
            const response = await fetch(url, { signal: controller.signal, credentials: 'omit' });
            if (!response.ok) throw new Error(`GIF: HTTP ${response.status}`);
            if (Number(response.headers.get('content-length')) > this.maxBytes) {
                throw new Error('GIF: source exceeds 100 MB / 源文件超过 100 MB');
            }
            source = await response.blob();
            if (source.size > this.maxBytes) throw new Error('GIF: source exceeds 100 MB / 源文件超过 100 MB');
        } finally { clearTimeout(timer); }

        const signature = await source.slice(0, 6).text();
        if (signature === 'GIF87a' || signature === 'GIF89a') {
            if (options.requireVideo) throw new Error('GIF: expected a video source / 需要视频源文件');
            progress('GIF 100%');
            const original = new Blob([source], { type: 'image/gif' });
            this.outputs.set(original, { native: true });
            return original;
        }

        const sourceUrl = URL.createObjectURL(source);
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        let pool = null;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.style.cssText = 'position:fixed;left:-10000px;width:1px;height:1px;pointer-events:none';
        document.body.appendChild(video);
        try {
            await this.waitFor(video, 'loadeddata', () => { video.src = sourceUrl; video.load(); });
            const duration = video.duration;
            if (!Number.isFinite(duration) || duration <= 0 || !video.videoWidth || !video.videoHeight) {
                throw new Error('GIF: invalid video metadata / 无效的视频信息');
            }
            const maxSeconds = options.maxSeconds ?? this.maxSeconds;
            let range = options.range || { start: 0, end: duration };
            if (!options.range && duration > maxSeconds && options.editRange) {
                progress('GIF ✂');
                range = await options.editRange({ url: sourceUrl, duration, maxSeconds });
                if (!range) {
                    const error = new Error('GIF conversion cancelled / 已取消 GIF 转换');
                    error.code = 'GIF_CANCELLED';
                    throw error;
                }
            }
            this.validateRange(range, duration, maxSeconds);
            const clipDuration = Math.min(range.end - range.start, maxSeconds);
            const profiles = this.profiles(video);
            let profile = options.profileId ? profiles.find(item => item.id === options.profileId) : profiles[0];
            if (!profile) throw new Error('Invalid GIF profile / 无效的 GIF 档位');
            let sizeChosen = false;
            pool = await GifWorkerPool.open();
            const prepareCanvas = current => {
                canvas.width = current.width;
                canvas.height = current.height;
                const context = canvas.getContext('2d', { willReadFrequently: true });
                if (!context) throw new Error('GIF: Canvas unavailable');
                return context;
            };
            const estimateProfile = async current => {
                const context = prepareCanvas(current);
                const sample = TmdGifenc.GIFEncoder();
                const frameCount = Math.max(1, Math.ceil(clipDuration * current.fps));
                const sampleCount = Math.min(6, frameCount);
                // Encode spread-out sample frames; GIF size depends on image complexity, not MP4 bitrate.
                for (let i = 0; i < sampleCount; i++) {
                    const frame = sampleCount === 1 ? 0 : Math.round(i * (frameCount - 1) / (sampleCount - 1));
                    try {
                        await this.writeFrame(video, canvas, context, sample, range.start + frame * clipDuration / frameCount, 70, pool);
                    } catch (error) {
                        if (error.code !== 'GIF_WORKER_ERROR' || !pool) throw error;
                        pool.close(); pool = null;
                        return estimateProfile(current);
                    }
                }
                sample.finish();
                return Math.ceil(sample.bytesView().byteLength / sampleCount * frameCount);
            };
            const measuredChoices = async (largestBytes, largestExact = false) => {
                const choices = this.sizeChoices(profiles, largestBytes, clipDuration, largestExact);
                // Resizing changes compression efficiency: measure each tier rather than scaling by pixel count.
                for (let i = 1; i < choices.length; i++) {
                    progress(`GIF ≈ ${i + 1}/${choices.length}`);
                    choices[i].bytes = await estimateProfile(profiles[i]);
                }
                return choices;
            };
            if (options.chooseSize && !options.profileId) {
                progress('GIF ≈');
                const estimate = await estimateProfile(profile);
                progress(`GIF ${MediaSize.format(estimate)}`);
                if (estimate > MediaSize.threshold) {
                    profile = await MediaSize.choose(await measuredChoices(estimate), options.chooseSize, 'GIF');
                    sizeChosen = true;
                }
            }
            const render = async current => {
                const context = prepareCanvas(current);
                const encoder = TmdGifenc.GIFEncoder();
                const count = Math.max(1, Math.ceil(clipDuration * current.fps));
                const pending = [];
                const flush = async () => {
                    const item = pending.shift();
                    const { pixels, palette } = await item.job;
                    encoder.writeFrame(pixels, canvas.width, canvas.height, { palette, delay: item.delay, repeat: 0 });
                    if (encoder.bytesView().byteLength > this.maxBytes) throw new Error('GIF: output exceeds 100 MB / GIF 文件超过 100 MB');
                    progress(`GIF ${Math.round((item.frame + 1) / count * 100)}%`);
                };
                try {
                    // Evenly sample the selected clip. Round cumulative timing to GIF's 10 ms units.
                    for (let frame = 0; frame < count; frame++) {
                        const start = Math.round(frame * clipDuration * 100 / count);
                        const end = Math.round((frame + 1) * clipDuration * 100 / count);
                        const time = range.start + frame * clipDuration / count;
                        const delay = Math.max(2, end - start) * 10;
                        if (pool) {
                            const rgba = await this.captureFrame(video, canvas, context, time);
                            pending.push({ frame, delay, job: pool.encode(rgba) });
                            if (pending.length >= pool.slots.length) await flush();
                            continue;
                        }
                        await this.writeFrame(video, canvas, context, encoder, time, delay);
                        if (encoder.bytesView().byteLength > this.maxBytes) {
                            throw new Error('GIF: output exceeds 100 MB / GIF 文件超过 100 MB');
                        }
                        progress(`GIF ${Math.round((frame + 1) / count * 100)}%`);
                    }
                    while (pending.length) await flush();
                } catch (error) {
                    if (pool) { pool.close(); pool = null; }
                    await Promise.allSettled(pending.map(item => item.job));
                    if (error.code === 'GIF_WORKER_ERROR') return render(current);
                    throw error;
                }
                encoder.finish();
                return new Blob([encoder.bytesView()], { type: 'image/gif' });
            };
            let result = await render(profile);
            // A sample can underestimate a changing scene. Offer sizes before download in that case too.
            if (!sizeChosen && options.chooseSize && !options.profileId && result.size > MediaSize.threshold) {
                profile = await MediaSize.choose(await measuredChoices(result.size, true), options.chooseSize, 'GIF');
                sizeChosen = true;
                if (profile.id !== profiles[0].id) result = await render(profile);
            }
            if (sizeChosen || options.sizeApproved) MediaSize.approvedGifs.add(result);
            this.outputs.set(result, { range: { ...range }, profiles });
            return result;
        } finally {
            pool?.close();
            video.pause();
            video.removeAttribute('src');
            video.load();
            video.remove();
            URL.revokeObjectURL(sourceUrl);
            canvas.width = canvas.height = 0;
        }
    }
}

class DownloadQueue {
    constructor(chooseSize) {
        this.chooseSize = chooseSize;
        this.tasks = [];
        this.thread = 0;
        this.max_thread = 2;
    }

    add(task) {
        this.tasks.push(task);
        if (this.thread < this.max_thread) {
            this.thread++;
            this.next();
        }
    }

    async next() {
        try {
            while (this.tasks.length) await this.start(this.tasks.shift());
        } finally { this.thread--; }
    }

    async start(task) {
        let objectUrl;
        let bytes;
        let estimatedBytes = false;
        let failure;
        try {
            let url = task.url;
            let name = task.name;
            if (task.videoOptions) {
                task.onprogress?.('MP4 ≈');
                const choices = await MediaSize.videoChoices(task.videoOptions.variants, task.videoOptions.duration);
                if (!choices.length) throw new Error('No MP4 source available / 未找到 MP4 视频源');
                let selected = choices[0];
                if (choices.some(choice => choice.bytes > MediaSize.threshold) || (choices.length > 1 && choices.some(choice => choice.bytes == null))) {
                    selected = await MediaSize.choose(choices, task.videoOptions.chooseSize, 'MP4');
                }
                url = selected.url;
                name = task.videoOptions.nameForUrl?.(url) || name;
                bytes = selected.bytes;
                estimatedBytes = selected.estimated;
                task.onprogress?.(`MP4 ${MediaSize.format(bytes, estimatedBytes)}`);
            }
            if (task.gif) {
                let blob = await GifConverter.convert(url, task.onprogress, task.gifOptions);
                // Independent final gate: no large GIF can reach GM_download without a size decision.
                // This also covers native GIFs and callers that omitted the converter's picker callback.
                if (blob.size > MediaSize.threshold && !MediaSize.approvedGifs.has(blob)) {
                    const metadata = GifConverter.outputs.get(blob);
                    const choices = metadata?.profiles
                        ? GifConverter.sizeChoices(metadata.profiles, blob.size, metadata.range.end - metadata.range.start, true)
                        : [{ id: 'original', bytes: blob.size, estimated: false, detail: 'Original GIF / 原始 GIF' }];
                    const picker = task.gifOptions?.chooseSize || this.chooseSize;
                    const selected = await MediaSize.choose(choices, picker && (details => picker({ ...details, name })), 'GIF');
                    if (metadata?.profiles && selected.id !== metadata.profiles[0].id) {
                        blob = await GifConverter.convert(url, task.onprogress, {
                            ...task.gifOptions, range: metadata.range, profileId: selected.id, sizeApproved: true
                        });
                    }
                    MediaSize.approvedGifs.add(blob);
                }
                bytes = blob.size;
                objectUrl = URL.createObjectURL(blob);
                url = objectUrl;
            }
            // Reuse the encoded GIF on download retries; report only the final failure.
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    await new Promise((resolve, reject) => {
                        GM_download({ url, name, onload: resolve, onerror: reject, ontimeout: reject });
                    });
                    failure = null;
                    break;
                } catch (error) { failure = error || new Error('Download failed'); }
            }
        } catch (error) { failure = error; }
        finally { if (objectUrl) URL.revokeObjectURL(objectUrl); }

        try {
            if (failure?.code === 'GIF_CANCELLED' && task.oncancel) await task.oncancel();
            else if (failure) await task.onerror(failure);
            else await task.onload(bytes, estimatedBytes);
        } catch (error) { console.error('[TMD] Download callback failed', error); }
    }
}


// Keep timeline constraints identical for pointer, keyboard, and numeric edits.
class GifTrimRange {
    static adjust(range, part, value, duration, maxSeconds) {
        const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
        const minimum = Math.min(0.01, duration);
        let { start, end } = range;
        let limited = false;
        if (!Number.isFinite(value)) return { start, end, limited };
        if (part === 'start') {
            limited = end - value > maxSeconds + 1e-8;
            start = clamp(value, Math.max(0, end - maxSeconds), end - minimum);
        } else if (part === 'end') {
            limited = value - start > maxSeconds + 1e-8;
            end = clamp(value, start + minimum, Math.min(duration, start + maxSeconds));
        } else if (part === 'move') {
            const length = end - start;
            start = clamp(value, 0, duration - length);
            end = start + length;
        }
        return { start, end, limited };
    }
}

class UIManager {
    static dialogTail = Promise.resolve();

    constructor(app) {
        this.app = app;
        this.lang = Config.language[document.documentElement.lang] || Config.language.en;
    }

    injectCSS() {
        document.head.insertAdjacentHTML('beforeend', `<style>${Config.media_btn_css}${Config.modal_structure_css}${Config.history_log_css}${Config.settings_form_css}</style>`);
    }

    setButtonStatus(btn, css, title) {
        btn.dataset.tmdVersion = Config.version;
        if (css !== 'loading') delete btn.dataset.tmdProgress;
        if (css) {
            btn.classList.remove('download', 'completed', 'exist', 'loading', 'failed');
            btn.classList.add(css);
        }
        if (title) btn.title = `${title} · v${Config.version}`;
    }

    addGifButton(downloadButton, run) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = document.documentElement.lang.startsWith('zh') ? '转 GIF' : 'GIF';
        button.className = 'tmd-down tmd-gif download';
        if (downloadButton.classList.contains('tmd-media')) button.classList.add('tmd-media');
        button.title = document.documentElement.lang.startsWith('zh')
            ? '视频转 GIF（最多 15 秒，长视频可裁剪，无声音）' : 'Convert video to GIF (up to 15 seconds; trim longer videos; no audio)';
        button.title += ` · v${Config.version}`;
        button.dataset.tmdVersion = Config.version;
        button.setAttribute('aria-label', button.title);
        button.onclick = event => {
            event.preventDefault();
            event.stopPropagation();
            if (!button.classList.contains('loading')) run(button);
        };
        downloadButton.insertAdjacentElement('afterend', button);
    }

    showNotice(message) {
        this.notice?.remove();
        const notice = document.createElement('div');
        notice.className = 'tmd-notice';
        notice.setAttribute('role', 'status');
        notice.textContent = message;
        document.body.appendChild(notice);
        this.notice = notice;
        setTimeout(() => notice.remove(), 6000);
    }

    withDialog(open) {
        const job = UIManager.dialogTail.then(open);
        UIManager.dialogTail = job.catch(() => {});
        return job;
    }

    chooseMediaSize(details) {
        return this.withDialog(() => this.renderMediaSize(details));
    }

    renderMediaSize({ kind, choices, name = '' }) {
        const zh = document.documentElement.lang.startsWith('zh');
        const label = (cn, en) => zh ? cn : en;
        return new Promise((resolve, reject) => {
            const previousFocus = document.activeElement;
            const dialog = document.createElement('dialog');
            dialog.className = 'tmd-size-dialog';
            dialog.setAttribute('aria-label', label(`选择 ${kind} 文件大小`, `Choose ${kind} file size`));
            dialog.innerHTML = `<style>
                .tmd-size-dialog{box-sizing:border-box;width:min(520px,94vw);max-height:90vh;overflow:auto;padding:24px;border:1px solid #64748b;border-radius:16px;background:oklch(21% .028 255);color:#f8fafc;font:15px/1.5 system-ui,sans-serif;color-scheme:dark}
                .tmd-size-dialog::backdrop{background:#000b}
                .tmd-size-dialog h2{font-size:22px;margin:0 0 8px}
                .tmd-size-dialog p{margin:8px 0;color:#cbd5e1}
                .tmd-size-dialog .tmd-size-name{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
                .tmd-size-dialog .tmd-size-choices{display:grid;gap:10px;margin:18px 0}
                .tmd-size-dialog .tmd-size-option{display:grid;grid-template-columns:20px 1fr auto;gap:4px 10px;padding:14px;border:1px solid #64748b;border-radius:8px;cursor:pointer}
                .tmd-size-dialog .tmd-size-option:has(input:checked){border:2px solid #5eead4;padding:13px;background:#064e3b}
                .tmd-size-dialog .tmd-size-option:hover{border-color:#5eead4}
                .tmd-size-dialog input{accent-color:#5eead4;margin:4px 0;align-self:start}
                .tmd-size-dialog .tmd-size-value{font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
                .tmd-size-dialog .tmd-size-detail{grid-column:2 / 4;font-size:13px;color:#cbd5e1}
                .tmd-size-dialog .tmd-size-note{font-size:13px}
                .tmd-size-dialog .tmd-size-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}
                .tmd-size-dialog button{padding:10px 16px;border:1px solid #64748b;border-radius:8px;background:#1e293b;color:#fff;font:inherit;cursor:pointer}
                .tmd-size-dialog button[data-action=confirm]{background:#065f46;border-color:#5eead4}
                .tmd-size-dialog :focus-visible{outline:2px solid #fff;outline-offset:3px}
                @media(max-width:480px){.tmd-size-dialog{padding:18px}.tmd-size-dialog .tmd-size-option{padding:10px;gap:4px 8px}.tmd-size-dialog .tmd-size-option:has(input:checked){padding:9px}}
            </style>
            <h2>${label(`选择 ${kind} 文件大小`, `Choose ${kind} file size`)}</h2>
            <p>${choices.length === 1 ? label('已确认文件超过 10 MB，请选择下载或取消。', 'The file exceeds 10 MB. Confirm the download or cancel.') : label('较大文件可选择更小档位，默认保留最大档。', 'Choose a smaller size if needed. The largest option is selected by default.')}</p>
            <p class="tmd-size-name"></p>
            <div class="tmd-size-choices"></div>
            <p class="tmd-size-note"></p>
            <div class="tmd-size-actions"><button type="button" data-action="cancel">${label('取消', 'Cancel')}</button><button type="button" data-action="confirm">${choices.length === 1 ? label('下载原文件', 'Download original') : kind === 'GIF' ? label('转换并下载', 'Convert & download') : label('下载所选档位', 'Download selection')}</button></div>`;
            const filename = dialog.querySelector('.tmd-size-name');
            filename.textContent = name;
            filename.title = name;
            dialog.querySelector('.tmd-size-note').textContent = kind === 'GIF' && choices.length === 1
                ? label('此原始 GIF 超过 10 MB。确认后按原文件保存，或取消下载。', 'This original GIF exceeds 10 MB. Confirm to keep the original file, or cancel.')
                : kind === 'GIF'
                ? label('≈ 为预估大小，实际结果随画面变化。小档会降低分辨率或帧率，时长不变。', '≈ means estimated size; the result depends on the images. Smaller options reduce resolution or frame rate, keeping the same duration.')
                : choices.length === 1
                    ? label('此视频仅提供一个 MP4 版本，暂无更小档位。', 'Only one MP4 version is available for this video.')
                    : label('较小档位可能降低清晰度。≈ 为按码率估算，实际大小可能不同。', 'Smaller options may reduce resolution. ≈ is a bitrate estimate; actual size may differ.');
            let chosen = choices[0]?.id;
            for (let i = 0; i < choices.length; i++) {
                const choice = choices[i];
                const option = document.createElement('label');
                option.className = 'tmd-size-option';
                option.innerHTML = '<input type="radio" name="tmd-file-size"><strong></strong><span class="tmd-size-value"></span><span class="tmd-size-detail"></span>';
                const radio = option.querySelector('input');
                radio.value = choice.id;
                radio.checked = i === 0;
                radio.onchange = () => { if (radio.checked) chosen = choice.id; };
                const tier = i === 0 ? label('大 · 默认', 'Large · Default') : i === choices.length - 1 ? label('小', 'Small') : label('中', 'Medium');
                option.querySelector('strong').textContent = tier;
                option.querySelector('.tmd-size-value').textContent = choice.bytes == null ? label('无法预估', 'Unknown size') : MediaSize.format(choice.bytes, choice.estimated);
                option.querySelector('.tmd-size-detail').textContent = choice.detail;
                dialog.querySelector('.tmd-size-choices').appendChild(option);
            }
            let settled = false;
            const finish = (value, error) => {
                if (settled) return;
                settled = true;
                dialog.close();
                dialog.remove();
                if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
                if (error) reject(error); else resolve(value);
            };
            dialog.querySelector('[data-action=confirm]').onclick = () => finish(chosen);
            dialog.querySelector('[data-action=cancel]').onclick = () => finish(null);
            dialog.oncancel = event => { event.preventDefault(); finish(null); };
            dialog.onclose = () => finish(null);
            document.body.appendChild(dialog);
            try { dialog.showModal(); } catch (error) { finish(null, error); }
        });
    }

    editGifRange(source) {
        return this.withDialog(() => this.renderGifRange(source));
    }

    renderGifRange({ url, duration, maxSeconds }) {
        const zh = document.documentElement.lang.startsWith('zh');
        const label = (cn, en) => zh ? cn : en;
        return new Promise((resolve, reject) => {
            const previousFocus = document.activeElement;
            const dialog = document.createElement('dialog');
            dialog.className = 'tmd-trim-editor';
            dialog.setAttribute('aria-label', label('裁剪视频并转为 GIF', 'Trim video to GIF'));
            dialog.innerHTML = `<style>
                .tmd-trim-editor{--trim-accent:oklch(83% .14 175);--trim-muted:oklch(75% .025 250);box-sizing:border-box;width:min(760px,94vw);max-height:92vh;overflow:auto;padding:24px;border:1px solid #64748b;border-radius:16px;background:oklch(21% .028 255);color:#f8fafc;font:15px/1.5 system-ui,sans-serif;color-scheme:dark;z-index:2147483647}
                .tmd-trim-editor::backdrop{background:#000b}
                .tmd-trim-editor h2{font-size:22px;margin:0 0 8px;color:inherit}
                .tmd-trim-editor p{margin:8px 0 14px;color:#cbd5e1}
                .tmd-trim-editor video{display:block;width:100%;max-height:29vh;background:#000;border-radius:8px}
                .tmd-trim-editor label{display:flex;align-items:center;gap:8px}
                .tmd-trim-editor input[type=number]{box-sizing:border-box;min-width:0;width:96px;padding:6px;border:1px solid #64748b;border-radius:6px;background:#1e293b;color:#fff;font:inherit;font-variant-numeric:tabular-nums}
                .tmd-trim-editor button{padding:9px 14px;border:1px solid #64748b;border-radius:8px;background:#1e293b;color:white;font:inherit;cursor:pointer}
                .tmd-trim-editor button:disabled{opacity:.45;cursor:not-allowed}
                .tmd-trim-editor button:hover:not(:disabled){border-color:var(--trim-accent)}
                .tmd-trim-editor .tmd-trim-legend,.tmd-trim-editor .tmd-trim-fields,.tmd-trim-editor .tmd-trim-clock{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:12px;font-variant-numeric:tabular-nums}
                .tmd-trim-editor .tmd-trim-legend{font-size:13px;color:var(--trim-muted);justify-content:flex-start}
                .tmd-trim-editor .tmd-trim-legend span{display:flex;gap:6px;align-items:center}
                .tmd-trim-editor .tmd-trim-legend i{display:inline-block;width:16px;height:12px;border:1px solid #94a3b8;background:repeating-linear-gradient(135deg,#64748b 0 2px,#273447 2px 6px)}
                .tmd-trim-editor .tmd-trim-legend .tmd-trim-kept{background:var(--trim-accent);border-color:var(--trim-accent)}
                .tmd-trim-editor .tmd-trim-legend .tmd-trim-position{width:3px;background:#fff;border:0}
                .tmd-trim-editor .tmd-trim-timeline{position:relative;height:64px;margin:18px 12px 0;touch-action:none;user-select:none;cursor:crosshair}
                .tmd-trim-editor .tmd-trim-track{position:absolute;inset:10px 0;border-radius:6px;background:repeating-linear-gradient(135deg,#475569 0 2px,#273447 2px 9px);box-shadow:inset 0 0 0 1px #64748b;overflow:hidden}
                .tmd-trim-editor .tmd-trim-selection{position:absolute;top:10px;height:44px;box-sizing:border-box;border:3px solid var(--trim-accent);background:oklch(42% .075 175);cursor:grab;min-width:2px}
                .tmd-trim-editor .tmd-trim-selection:active{cursor:grabbing}
                .tmd-trim-editor .tmd-trim-selection::after{content:'↔';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:var(--trim-accent);font-size:22px;pointer-events:none}
                .tmd-trim-editor .tmd-trim-handle{position:absolute;top:4px;width:22px;height:56px;transform:translateX(-50%);box-sizing:border-box;border:2px solid #072e29;border-radius:6px;background:var(--trim-accent);color:#072e29;cursor:ew-resize;z-index:3;display:grid;place-items:center;font-size:18px;font-weight:800}
                .tmd-trim-editor .tmd-trim-handle:hover{background:#d1fae5}
                .tmd-trim-editor .tmd-trim-playhead{position:absolute;top:0;bottom:0;width:2px;background:#fff;transform:translateX(-50%);pointer-events:none;z-index:4;box-shadow:0 0 0 1px #0008}
                .tmd-trim-editor .tmd-trim-playhead::before{content:'';position:absolute;left:-4px;top:-1px;border:5px solid transparent;border-top-color:#fff}
                .tmd-trim-editor .tmd-trim-ticks{display:flex;justify-content:space-between;margin:2px 12px 0;color:var(--trim-muted);font-size:12px;font-variant-numeric:tabular-nums}
                .tmd-trim-editor .tmd-trim-help{font-size:12px;margin:8px 0;color:var(--trim-muted)}
                .tmd-trim-editor .tmd-trim-warning{color:#fbbf24;min-height:20px;font-size:13px;margin-top:4px}
                .tmd-trim-editor .tmd-trim-at-limit{--trim-accent:oklch(85% .16 85)}
                .tmd-trim-editor .tmd-trim-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;margin-top:18px}
                .tmd-trim-editor .tmd-trim-confirm{background:#065f46;border-color:var(--trim-accent)}
                .tmd-trim-editor .tmd-trim-summary{display:block;color:var(--trim-accent);font-variant-numeric:tabular-nums}
                .tmd-trim-editor :focus-visible{outline:2px solid #fff;outline-offset:3px}
                @media(max-width:480px){.tmd-trim-editor{padding:16px;font-size:14px}.tmd-trim-editor h2{font-size:20px}.tmd-trim-editor .tmd-trim-fields{gap:8px}.tmd-trim-editor input[type=number]{width:78px}.tmd-trim-editor .tmd-trim-actions button{flex:1;padding:9px 8px}}
            </style>
            <h2>${label('裁剪视频并转为 GIF', 'Trim video to GIF')}</h2>
            <p>${label(`视频长 ${duration.toFixed(2)} 秒。请选择不超过 ${maxSeconds} 秒的片段，GIF 不包含声音。`, `Video length: ${duration.toFixed(2)}s. Select up to ${maxSeconds}s. GIFs have no audio.`)}</p>
            <video playsinline muted preload="auto" aria-label="${label('视频预览', 'Video preview')}"></video>
            <div class="tmd-trim-clock"><span data-current-time>0.00 / ${duration.toFixed(2)} s</span><output class="tmd-trim-summary" aria-live="polite"></output></div>
            <div class="tmd-trim-legend"><span><i class="tmd-trim-kept"></i>${label('保留片段', 'Keep')}</span><span><i></i>${label('移除片段', 'Remove')}</span><span><i class="tmd-trim-position"></i>${label('当前画面', 'Playhead')}</span></div>
            <div class="tmd-trim-timeline" aria-label="${label('剪辑时间轴', 'Trim timeline')}">
                <div class="tmd-trim-track"></div>
                <div class="tmd-trim-selection" data-drag="move" role="slider" tabindex="0" aria-label="${label('移动保留片段', 'Move selection')}"></div>
                <div class="tmd-trim-handle" data-drag="start" role="slider" tabindex="0" aria-label="${label('剪辑开始时间', 'Trim start')}">❮</div>
                <div class="tmd-trim-handle" data-drag="end" role="slider" tabindex="0" aria-label="${label('剪辑结束时间', 'Trim end')}">❯</div>
                <div class="tmd-trim-playhead"></div>
            </div>
            <div class="tmd-trim-ticks"><span>0 s</span><span>${(duration / 2).toFixed(2)} s</span><span>${duration.toFixed(2)} s</span></div>
            <p class="tmd-trim-help">${label('拖动两端调整时长，拖动中间整体移动；点击时间轴预览画面。方向键微调，Shift 加速。', 'Drag the handles to trim or the center to move. Click to seek. Arrow keys fine-tune; Shift moves faster.')}</p>
            <div class="tmd-trim-fields">
                <label>${label('开始（秒）', 'Start (s)')} <input data-field="start" type="number" min="0" max="${duration}" step="0.01" value="0"></label>
                <label>${label('结束（秒）', 'End (s)')} <input data-field="end" type="number" min="0" max="${duration}" step="0.01" value="${Math.min(maxSeconds, duration)}"></label>
            </div>
            <div class="tmd-trim-warning" role="status" aria-live="polite"></div>
            <div class="tmd-trim-actions">
                <button type="button" data-action="preview">${label('播放选中片段', 'Play selection')}</button>
                <button type="button" data-action="cancel">${label('取消', 'Cancel')}</button>
                <button type="button" data-action="confirm" class="tmd-trim-confirm">${label('转换为 GIF', 'Convert to GIF')}</button>
            </div>`;
            const video = dialog.querySelector('video');
            const fields = Object.fromEntries(['start', 'end'].map(key => [key, dialog.querySelector(`[data-field="${key}"]`)]));
            const timeline = dialog.querySelector('.tmd-trim-timeline');
            const selection = dialog.querySelector('.tmd-trim-selection');
            const handles = Object.fromEntries(['start', 'end', 'move'].map(key => [key, dialog.querySelector(`[data-drag="${key}"]`)]));
            const playhead = dialog.querySelector('.tmd-trim-playhead');
            const clock = dialog.querySelector('[data-current-time]');
            const warning = dialog.querySelector('.tmd-trim-warning');
            const confirm = dialog.querySelector('[data-action="confirm"]');
            const preview = dialog.querySelector('[data-action="preview"]');
            const summary = dialog.querySelector('output');
            let settled = false;
            let playingSelection = false;
            let selected = { start: 0, end: Math.min(duration, maxSeconds) };
            let drag = null;
            const range = () => ({ start: selected.start, end: selected.end });
            const valid = () => {
                try {
                    GifConverter.validateRange({ start: fields.start.valueAsNumber, end: fields.end.valueAsNumber }, duration, maxSeconds);
                    GifConverter.validateRange(range(), duration, maxSeconds);
                    return true;
                }
                catch { return false; }
            };
            const refresh = (message = '') => {
                const ok = valid();
                confirm.disabled = preview.disabled = !ok;
                summary.textContent = label(`保留 ${(selected.end - selected.start).toFixed(2)} 秒 / ${maxSeconds} 秒`, `Keep ${(selected.end - selected.start).toFixed(2)}s / ${maxSeconds}s`);
                warning.textContent = message || (ok ? '' : label('请输入有效的起止时间。', 'Enter valid start and end times.'));
                timeline.classList.toggle('tmd-trim-at-limit', Boolean(message));
                selection.style.left = `${selected.start / duration * 100}%`;
                selection.style.width = `${(selected.end - selected.start) / duration * 100}%`;
                for (const key of ['start', 'end']) handles[key].style.left = `${selected[key] / duration * 100}%`;
                const bounds = {
                    start: [Math.max(0, selected.end - maxSeconds), selected.end - 0.01, selected.start],
                    end: [selected.start + 0.01, Math.min(duration, selected.start + maxSeconds), selected.end],
                    move: [0, duration - (selected.end - selected.start), selected.start]
                };
                for (const [key, [min, max, now]] of Object.entries(bounds)) {
                    handles[key].setAttribute('aria-valuemin', min.toFixed(2));
                    handles[key].setAttribute('aria-valuemax', max.toFixed(2));
                    handles[key].setAttribute('aria-valuenow', now.toFixed(2));
                    handles[key].setAttribute('aria-valuetext', key === 'move'
                        ? `${selected.start.toFixed(2)} – ${selected.end.toFixed(2)} ${label('秒', 'seconds')}`
                        : `${now.toFixed(2)} ${label('秒', 'seconds')}`);
                }
            };
            const seek = time => {
                playingSelection = false;
                video.pause();
                video.currentTime = Math.max(0, Math.min(duration, time));
                updatePlayhead();
            };
            const updatePlayhead = () => {
                const time = Math.max(0, Math.min(duration, video.currentTime || 0));
                playhead.style.left = `${time / duration * 100}%`;
                clock.textContent = `${time.toFixed(2)} / ${duration.toFixed(2)} s`;
            };
            const apply = (part, value, base = selected) => {
                const next = GifTrimRange.adjust(base, part, value, duration, maxSeconds);
                selected = { start: next.start, end: next.end };
                for (const key of ['start', 'end']) fields[key].value = Math.min(duration, Number(selected[key].toFixed(8)));
                refresh(next.limited ? label(`最多保留 ${maxSeconds} 秒，已阻止继续扩大。可缩短片段或拖动中间整体移动。`, `Maximum ${maxSeconds}s reached. Shorten the selection or drag its center to move it.`) : '');
                seek(part === 'end' ? selected.end : selected.start);
            };
            const finish = (value, error) => {
                if (settled) return;
                settled = true;
                drag = null;
                video.pause();
                video.removeAttribute('src');
                video.load();
                dialog.close();
                dialog.remove();
                if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
                if (error) reject(error); else resolve(value);
            };
            for (const key of ['start', 'end']) {
                // Commit numeric changes on blur/Enter so clamping cannot interrupt typing.
                fields[key].oninput = () => { video.pause(); playingSelection = false; refresh(); };
                fields[key].onchange = () => {
                    if (Number.isFinite(fields[key].valueAsNumber)) apply(key, fields[key].valueAsNumber);
                };
                fields[key].onkeydown = event => { if (event.key === 'Enter') { event.preventDefault(); fields[key].blur(); } };
            }
            timeline.onpointerdown = event => {
                if (event.button !== 0 || drag) return;
                const target = event.target.closest('[data-drag]');
                const rect = timeline.getBoundingClientRect();
                if (!target) { seek((event.clientX - rect.left) / rect.width * duration); return; }
                event.preventDefault();
                target.focus({ preventScroll: true });
                video.pause();
                playingSelection = false;
                drag = { id: event.pointerId, part: target.dataset.drag, x: event.clientX, rect, base: range(), moved: false };
                timeline.setPointerCapture(event.pointerId);
            };
            timeline.onpointermove = event => {
                if (!drag || event.pointerId !== drag.id) return;
                const pixels = event.clientX - drag.x;
                if (!drag.moved && Math.abs(pixels) < 3) return;
                drag.moved = true;
                const delta = pixels / drag.rect.width * duration;
                const initial = drag.part === 'end' ? drag.base.end : drag.base.start;
                const time = Math.round((initial + delta) * 100) / 100;
                apply(drag.part, time, drag.base);
            };
            timeline.onpointerup = event => {
                if (!drag || event.pointerId !== drag.id) return;
                if (!drag.moved && drag.part === 'move') seek((event.clientX - drag.rect.left) / drag.rect.width * duration);
                drag = null;
                timeline.releasePointerCapture(event.pointerId);
            };
            timeline.onpointercancel = timeline.onlostpointercapture = () => { drag = null; };
            for (const [part, handle] of Object.entries(handles)) {
                handle.onkeydown = event => {
                    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
                    event.preventDefault();
                    const current = part === 'end' ? selected.end : selected.start;
                    const direction = ['ArrowRight', 'ArrowUp'].includes(event.key) ? 1 : -1;
                    const value = event.key === 'Home' ? 0 : event.key === 'End' ? duration : current + direction * (event.shiftKey ? 1 : 0.1);
                    apply(part, Math.round(value * 100) / 100);
                };
            }
            preview.onclick = async () => {
                if (!video.paused) { video.pause(); return; }
                if (!valid()) return;
                playingSelection = true;
                video.currentTime = range().start;
                try { await video.play(); }
                catch { if (!settled) summary.textContent = label('无法播放预览，请重试。', 'Preview could not play. Please retry.'); }
            };
            video.ontimeupdate = () => {
                updatePlayhead();
                if (playingSelection && video.currentTime >= range().end) {
                    video.pause();
                    playingSelection = false;
                    video.currentTime = range().end;
                }
            };
            video.onseeking = video.onseeked = updatePlayhead;
            video.onplay = () => { preview.textContent = label('暂停预览', 'Pause preview'); };
            video.onpause = () => { preview.textContent = label('播放选中片段', 'Play selection'); };
            video.onerror = () => { if (!settled) finish(null, new Error('GIF: preview decoding failed / 预览视频解码失败')); };
            confirm.onclick = () => { if (valid()) finish(range()); };
            dialog.querySelector('[data-action="cancel"]').onclick = () => finish(null);
            dialog.oncancel = event => { event.preventDefault(); finish(null); };
            dialog.onclose = () => finish(null);
            document.body.appendChild(dialog);
            try {
                video.src = url;
                video.muted = true;
                refresh();
                dialog.showModal();
            } catch (error) { finish(null, error); }
        });
    }

    renderHistoryUI() {
        const float_btn_css = `.tmd-history-btn label:before {content: " "; width: 32px; height: 16px; background-position: center; background-repeat: no-repeat; background-image:url("${Config.logIconUri}");}`;
        document.head.insertAdjacentHTML('beforeend', `<style>${float_btn_css}</style>`);

        this.historyBtn = document.createElement('div');
        this.historyBtn.title = this.lang.history;
        this.historyBtn.classList.add('tmd-history-btn');

        if (this.app.storage.theme === 'dark') {
            this.historyBtn.classList.add('tmd-dark-theme');
        }

        this.historyBtn.innerHTML = `<label>${this.app.storage.history.length}</label>`;
        document.body.appendChild(this.historyBtn);

        this.historyBtn.onclick = () => this.showModal();
    }

    updateHistoryCount() {
        if (this.historyBtn) {
            this.historyBtn.querySelector('label').innerText = this.app.storage.history.length;
        }
    }

    getLang() {
        let pref = this.app.storage.lang;
        if (pref !== 'auto' && Config.language[pref]) {
            return Config.language[pref];
        }
        return Config.language[document.documentElement.lang] || Config.language.en;
    }

    showModal(startView = 'history') {
        let currentView = startView;
        this.lang = this.getLang();

        const $element = (parent, tag, className, content) => {
            let el = document.createElement(tag);
            if (className) el.className = className;
            if (content) el.innerHTML = content;
            parent.appendChild(el);
            return el;
        };

        const formatDt = (ts) => {
            if (!ts) return this.lang.unknown_date || 'Unknown Date';
            let d = new Date(ts);
            let pad = n => n.toString().padStart(2, '0');
            return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        let wapper = $element(document.body, 'div', 'tmd-modal-wrapper');
        wapper.onclick = (e) => { if (e.target === wapper) wapper.remove(); };

        let dialog = $element(wapper, 'div', 'tmd-modal-dialog');
        if (this.app.storage.theme === 'dark') dialog.classList.add('tmd-dark-theme');

        let header = $element(dialog, 'div', 'tmd-modal-header');
        let headerLeft = $element(header, 'div', 'tmd-modal-header-left');
        let backIcon = (Config.icon_svg && Config.icon_svg.back) ? Config.icon_svg.back : '←';
        let backBtn = $element(headerLeft, 'button', 'tmd-icon-btn', backIcon);
        let titleEl = $element(headerLeft, 'h3', 'tmd-modal-title', '');
        let headerActions = $element(header, 'div', 'tmd-modal-actions');

        let langSelect = $element(headerActions, 'select', 'tmd-lang-select');
        let langOptions = [
            { val: 'auto', txt: 'Auto' },
            { val: 'en', txt: 'English' },
            { val: 'ja', txt: '日本語' },
            { val: 'zh', txt: '简体中文' },
            { val: 'zh-Hant', txt: '繁體中文' }
        ];
        langOptions.forEach(l => {
            let opt = $element(langSelect, 'option', '', l.txt);
            opt.value = l.val;
            if (this.app.storage.lang === l.val) opt.selected = true;
        });

        langSelect.onchange = async () => {
            await this.app.storage.setSetting('tmd_lang', langSelect.value);
            wapper.remove();
            this.showModal(currentView);
        };

        let themeBtn = $element(headerActions, 'button', 'tmd-icon-btn');
        let sunIcon = (Config.icon_svg && Config.icon_svg.sun) ? Config.icon_svg.sun : 'S';
        let moonIcon = (Config.icon_svg && Config.icon_svg.moon) ? Config.icon_svg.moon : 'M';
        themeBtn.innerHTML = this.app.storage.theme === 'dark' ? sunIcon : moonIcon;
        themeBtn.title = 'Toggle Theme';
        themeBtn.onclick = async () => {
            let newTheme = this.app.storage.theme === 'dark' ? 'light' : 'dark';
            await this.app.storage.setSetting('tmd_theme', newTheme);
            themeBtn.innerHTML = newTheme === 'dark' ? sunIcon : moonIcon;
            dialog.classList.toggle('tmd-dark-theme', newTheme === 'dark');
            if (this.historyBtn) {
                this.historyBtn.classList.toggle('tmd-dark-theme', newTheme === 'dark');
            }
        };

        let setIcon = (Config.icon_svg && Config.icon_svg.settings) ? Config.icon_svg.settings : '⚙';
        let settingsBtn = $element(headerActions, 'button', 'tmd-icon-btn', setIcon);
        settingsBtn.title = this.lang.settings || 'Settings';

        let clearIcon = (Config.icon_svg && Config.icon_svg.clear) ? Config.icon_svg.clear : '🗑';
        let clearBtn = $element(headerActions, 'button', 'tmd-icon-btn danger', clearIcon);
        const dialogLang = this.lang.dialog || {};
        clearBtn.title = dialogLang.clear_history || 'Clear History';

        let closeIcon = (Config.icon_svg && Config.icon_svg.close) ? Config.icon_svg.close : 'X';
        let closeBtn = $element(headerActions, 'button', 'tmd-icon-btn', closeIcon);
        closeBtn.onclick = () => wapper.remove();

        let historyContainer = $element(dialog, 'div', 'tmd-modal-content');
        let settingsContainer = $element(dialog, 'div', 'tmd-modal-settings');
        let top_settings_row = $element(settingsContainer, 'div', 'tmd-pattern-header');
        top_settings_row.style.alignItems = 'center';

        let left_checkbox_group = $element(top_settings_row, 'div');
        left_checkbox_group.style.display = 'flex';
        left_checkbox_group.style.flexDirection = 'column';
        left_checkbox_group.style.gap = '10px';

        let save_history_label = $element(left_checkbox_group, 'label', 'tmd-checkbox-label');
        save_history_label.style.marginBottom = '0';
        let save_history_input = $element(save_history_label, 'input');
        save_history_input.type = 'checkbox';
        save_history_input.checked = this.app.storage.saveHistoryFlag;
        $element(save_history_label, 'span', '', dialogLang.save_history || 'Remember download history');

        let auto_bookmark_label = $element(left_checkbox_group, 'label', 'tmd-checkbox-label');
        auto_bookmark_label.style.marginBottom = '0';
        let auto_bookmark_input = $element(auto_bookmark_label, 'input');
        auto_bookmark_input.type = 'checkbox';
        auto_bookmark_input.checked = this.app.storage.autoBookmarkFlag;
        $element(auto_bookmark_label, 'span', '', dialogLang.auto_bookmark || 'Auto Bookmark');

        let shortcut_label = $element(top_settings_row, 'div', 'tmd-pattern-label');
        shortcut_label.style.marginBottom = '0';
        shortcut_label.innerHTML = `${dialogLang.shortcut || 'Shortcut:'}`;
        let shortcut_input = $element(shortcut_label, 'input', 'tmd-textarea');
        shortcut_input.style.cssText = 'width: 50px; height: 32px; padding: 4px; text-align: center; margin-left: 10px; font-weight: bold; text-transform: uppercase; display: inline-block;';
        shortcut_input.maxLength = 1;
        shortcut_input.value = this.app.storage.shortcutKey || 'D';
        shortcut_input.oninput = () => { shortcut_input.value = shortcut_input.value.toUpperCase(); };

        let pattern_header = $element(settingsContainer, 'div', 'tmd-pattern-header');
        pattern_header.style.marginTop = '20px';
        $element(pattern_header, 'label', 'tmd-pattern-label', dialogLang.pattern || 'File Pattern');

        let pattern_actions = $element(pattern_header, 'div', 'tmd-modal-actions');
        let modeBtn = $element(pattern_actions, 'button', 'tmd-btn-reset');
        let resetBtn = $element(pattern_actions, 'button', 'tmd-btn-reset', dialogLang.reset || '(Reset)');

        let tag_mode_ui = $element(settingsContainer, 'div');
        let active_container = $element(tag_mode_ui, 'div', 'tmd-active-tags-box');
        let available_container = $element(tag_mode_ui, 'div', 'tmd-available-tags-box');

        let custom_mode_ui = $element(settingsContainer, 'div');
        let pattern_input = $element(custom_mode_ui, 'textarea', 'tmd-textarea');
        let custom_tag_container = $element(custom_mode_ui, 'div', 'tmd-tag-container');

        const tagsDict = dialogLang.tags || {};

        const excludedTags = ['{media-count}', '{date-time}'];  // '{full-text}',
        let validTagsKeys = Object.keys(tagsDict).filter(tag => !excludedTags.includes(tag));

        validTagsKeys.forEach(tagText => {
            let btnText = `${tagsDict[tagText]}`;
            let tagBtn = $element(custom_tag_container, 'div', 'tmd-available-tag', btnText);
            tagBtn.onclick = () => {
                let start = pattern_input.selectionStart || 0;
                let end = pattern_input.selectionEnd || 0;
                let val = pattern_input.value || '';
                pattern_input.value = val.substring(0, start) + tagText + val.substring(end);
                pattern_input.selectionStart = pattern_input.selectionEnd = start + tagText.length;
                pattern_input.focus();
                updatePreview();
            };
        });

        let currentPattern = this.app.storage.filenamePattern || Config.defaultFilename || '{user-name}-{status-id}';
        let extracted = (currentPattern.match(/\{[^}]+\}/g) || []).filter(t => validTagsKeys.includes(t));
        let uniqueTags = [...new Set(extracted)];

        let isCustomMode = currentPattern !== uniqueTags.join('_');
        let activeTags = uniqueTags;

        const updateTagModeUI = () => {
            active_container.innerHTML = '';
            available_container.innerHTML = '';
            let draggedItem = null;

            activeTags.forEach((tag, idx) => {
                let el = $element(active_container, 'div', 'tmd-active-tag');
                el.draggable = true;
                el.dataset.idx = idx;

                el.innerHTML = `
                    <span class="tmd-drag-handle"><svg viewBox="0 0 10 10" width="12" height="12" fill="currentColor"><path d="M3 2a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm4-8a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2z"/></svg></span>
                    ${tagsDict[tag]}
                    <span class="tmd-tag-close"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
                `;

                el.ondragstart = function (e) { draggedItem = this; e.dataTransfer.effectAllowed = 'move'; setTimeout(() => this.classList.add('dragging'), 0); };
                el.ondragend = function () { this.classList.remove('dragging'); draggedItem = null; };
                el.ondragover = function (e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; return false; };

                el.ondrop = function (e) {
                    e.stopPropagation();
                    if (draggedItem && draggedItem !== this) {
                        let fromIdx = parseInt(draggedItem.dataset.idx);
                        let toIdx = parseInt(this.dataset.idx);
                        let [moved] = activeTags.splice(fromIdx, 1);
                        activeTags.splice(toIdx, 0, moved);

                        if (!isCustomMode) pattern_input.value = activeTags.join('_');
                        updateTagModeUI();
                        updatePreview();
                    }
                    return false;
                };

                el.querySelector('.tmd-tag-close').onclick = () => {
                    activeTags.splice(idx, 1);
                    if (!isCustomMode) pattern_input.value = activeTags.join('_');
                    updateTagModeUI();
                    updatePreview();
                };
            });

            validTagsKeys.forEach(tag => {
                if (!activeTags.includes(tag)) {
                    let el = $element(available_container, 'div', 'tmd-available-tag', tagsDict[tag]);
                    el.onclick = () => {
                        activeTags.push(tag);
                        if (!isCustomMode) pattern_input.value = activeTags.join('_');
                        updateTagModeUI();
                        updatePreview();
                    };
                }
            });
        };

        const toggleMode = () => {
            modeBtn.innerText = isCustomMode ? (dialogLang.tag_mode || 'Tag Mode') : (dialogLang.custom_mode || 'Custom Mode');
            tag_mode_ui.style.display = isCustomMode ? 'none' : 'block';
            custom_mode_ui.style.display = isCustomMode ? 'block' : 'none';

            if (!isCustomMode) {
                let currentText = pattern_input.value || '';
                let textExtracted = (currentText.match(/\{[^}]+\}/g) || []).filter(t => validTagsKeys.includes(t));
                activeTags = [...new Set(textExtracted)];
                pattern_input.value = activeTags.join('_');
                updateTagModeUI();
            }
            updatePreview();
        };

        modeBtn.onclick = () => { isCustomMode = !isCustomMode; toggleMode(); };

        resetBtn.onclick = () => {
            if (isCustomMode) {
                pattern_input.value = Config.defaultFilename || '{user-name}_{status-id}';
            } else {
                activeTags = ['{user-name}', '{status-id}', '{index}'];
                pattern_input.value = activeTags.join('_');
                updateTagModeUI();
            }
            updatePreview();
        };

        let preview_title = $element(settingsContainer, 'div', 'tmd-pattern-label', dialogLang.preview || 'Preview:');
        preview_title.style.marginTop = '15px';
        let preview_box = $element(settingsContainer, 'div', 'tmd-preview-box');
        let preview_error = $element(settingsContainer, 'div', 'tmd-preview-error', dialogLang.empty_pattern || 'Empty');
        let saveSettingsBtn = $element(settingsContainer, 'button', 'tmd-btn-save', dialogLang.save || 'Save');

        const updatePreview = () => {
            let val = pattern_input.value.trim();
            if (!val) {
                preview_error.style.display = 'block'; preview_box.style.display = 'none'; saveSettingsBtn.disabled = true; return;
            }
            preview_error.style.display = 'none'; preview_box.style.display = 'block'; saveSettingsBtn.disabled = false;

            let mockInfo = {
                'status-id': '20231011', 'user-name': 'Jingliu', 'user-id': 'Jingliu_love',
                'rt-user-name': 'Zpang', 'rt-user-id': 'chirong726',  // <--- 新增這兩項
                'fav-count': '999', 'file-type': 'photo', 'file-name': 'original_pic', 'media-count': '2', 'index': '1'
            };

            let out = val.split('\n').join('');
            let invalid = Utils.getInvalidChars ? Utils.getInvalidChars() : {};
            let datetime = out.match(/{date-time(-local)?:[^{}]+}/) ? out.match(/{date-time(?:-local)?:([^{}]+)}/)[1].replace(/[\\/|<>*?:"]/g, v => invalid[v] || '') : 'YYYYMMDD-hhmmss';

            if (Utils.formatDate) {
                mockInfo['date-time'] = Utils.formatDate(Date.now(), datetime);
                mockInfo['date-time-local'] = Utils.formatDate(Date.now(), datetime, true);
            }

            let textLength = out.match(/{full-text:(\d+)}/) ? parseInt(out.match(/{full-text:(\d+)}/)[1], 10) : 999;
            mockInfo['full-text'] = 'This is a sample tweet text preview.'.substring(0, textLength);

            let parsed = (out.replace(/\.?{file-ext}/, '') + (!out.includes('{index}') && !out.includes('{file-name}') ? '-1' : '') + '.jpg').replace(/{([^{}:]+)(:[^{}]+)?}/g, (_, name) => mockInfo[name] != null ? mockInfo[name] : '');
            preview_box.innerText = parsed;
        };
        pattern_input.addEventListener('input', updatePreview);

        pattern_input.value = currentPattern;
        updateTagModeUI();
        toggleMode();

        const updateView = () => {
            if (currentView === 'history') {
                let histLen = this.app.storage.history ? this.app.storage.history.length : 0;
                titleEl.innerText = `${this.lang.history || 'History'} (${histLen})`;
                backBtn.style.display = 'none'; settingsBtn.style.display = 'flex'; clearBtn.style.display = 'flex';
                historyContainer.style.display = 'block'; settingsContainer.style.display = 'none';

                historyContainer.innerHTML = '';
                if (histLen === 0) {
                    $element(historyContainer, 'p', 'tmd-empty-text', this.lang.empty || 'Empty');
                } else {
                    let tableWrap = $element(historyContainer, 'div', 'tmd-table-wrapper');
                    let table = $element(tableWrap, 'table', 'tmd-table');
                    let thead = $element(table, 'thead');
                    let trHead = $element(thead, 'tr');

                    const tableLang = this.lang.table || {};
                    ['thumb', 'user', 'type', 'size', 'postTime', 'downTime', 'action'].forEach(k => {
                        let th = $element(trHead, 'th');
                        $element(th, 'div', 'tmd-th-inner', tableLang[k] || k);
                    });

                    let tbody = $element(table, 'tbody');
                    let historyCopy = [...this.app.storage.history].reverse();

                    historyCopy.forEach(item => {
                        let tr = $element(tbody, 'tr');

                        let tdThumb = $element(tr, 'td');
                        if (item.thumb) {
                            let img = $element(tdThumb, 'img', 'tmd-thumb');
                            img.src = item.thumb;
                        } else { tdThumb.innerText = '-'; }

                        $element(tr, 'td', '', item.user || '-');
                        $element(tr, 'td', '', item.type || '-');
                        $element(tr, 'td', '', item.size || 'Unknown');
                        $element(tr, 'td', '', formatDt(item.postTime));
                        $element(tr, 'td', '', formatDt(item.time));

                        let tdAction = $element(tr, 'td');
                        let goBtn = $element(tdAction, 'button', 'tmd-action-btn', tableLang.go || 'Go');
                        goBtn.onclick = () => window.open(`https://x.com/i/status/${item.id}`, '_blank');

                        let delBtn = $element(tdAction, 'button', 'tmd-action-btn del', tableLang.del || 'Delete');
                        delBtn.onclick = async () => {
                            await this.app.storage.removeHistory(item.id);
                            if (this.updateHistoryCount) this.updateHistoryCount();
                            updateView();
                        };
                    });
                }
            } else {
                titleEl.innerText = dialogLang.title || 'Settings';
                backBtn.style.display = 'flex'; settingsBtn.style.display = 'none'; clearBtn.style.display = 'none';
                historyContainer.style.display = 'none'; settingsContainer.style.display = 'block';
            }
        };

        settingsBtn.onclick = () => { currentView = 'settings'; updateView(); };
        backBtn.onclick = () => { currentView = 'history'; updateView(); };

        clearBtn.onclick = async () => {
            if (confirm(dialogLang.clear_confirm || 'Clear all?')) {
                await this.app.storage.clearHistory();
                if (this.updateHistoryCount) this.updateHistoryCount();
                updateView();
            }
        };

        saveSettingsBtn.onclick = async () => {
            await this.app.storage.setSetting('save_history', save_history_input.checked);
            await this.app.storage.setSetting('auto_bookmark', auto_bookmark_input.checked);
            await this.app.storage.setSetting('filename', pattern_input.value);
            await this.app.storage.setSetting('shortcut_key', shortcut_input.value);

            saveSettingsBtn.innerText = this.lang.saved || 'Saved';
            saveSettingsBtn.classList.add('saved'); saveSettingsBtn.disabled = true;
            setTimeout(() => wapper.remove(), 200);
        };

        updateView();
    }

    addButtonsToArticle(article) {
        if (article.dataset.detected) return;
        article.dataset.detected = 'true';

        let retweeter_name = '';
        let retweeter_id = '';

        let media = article.querySelector(['video', '[data-testid="videoPlayer"]', 'a[href*="/photo/1"]', 'div[role="progressbar"]', 'button[data-testid="playButton"]', 'a[href="/settings/content_you_see"]', 'div.media-image-container', 'div.media-preview-container', 'div[aria-labelledby]>div:first-child>div[role="button"][tabindex="0"]'].join(','));
        if (media) {
            let status_id = article.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();

            let socialContext = article.querySelector('[data-testid="socialContext"]');
            if (socialContext) {
                let rawText = socialContext.textContent.trim();
                let lastSpaceIndex = rawText.lastIndexOf(' ');
                retweeter_name = lastSpaceIndex !== -1 ? rawText.substring(0, lastSpaceIndex).trim() : rawText;
                let href = socialContext.closest('a')?.getAttribute('href');
                retweeter_id = href ? href.replace('/', '') : '';
            }

            let btn_share = Array.from(article.querySelector('div[role="group"]:last-of-type, ul.tweet-actions, ul.tweet-detail-actions').querySelectorAll(':scope>div>div, li.tweet-action-item>a, li.tweet-detail-action-item>a')).pop().parentNode;
            let btn_down = btn_share.cloneNode(true);

            btn_down.querySelector('button')?.removeAttribute('disabled');
            if (this.app.isTweetDeck) {
                btn_down.firstElementChild.innerHTML = `<svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">${Config.svg}</svg>`;
                btn_down.firstElementChild.removeAttribute('rel');
                btn_down.classList.replace("pull-left", "pull-right");
            } else {
                btn_down.querySelector('svg').innerHTML = Config.svg;
            }

            let is_exist = this.app.storage.isDownloaded(status_id);
            this.setButtonStatus(btn_down, 'tmd-down');
            this.setButtonStatus(btn_down, is_exist ? 'exist' : 'download', is_exist ? this.lang.completed : this.lang.download);

            btn_share.parentNode.insertBefore(btn_down, btn_share.nextSibling);
            this.addGifButton(btn_down, gifButton => this.app.handleDownloadClick(
                gifButton, status_id, is_exist, null, retweeter_name, retweeter_id, { videoGif: true }
            ));
            btn_down.onclick = () => {
                this.app.handleDownloadClick(btn_down, status_id, is_exist, null, retweeter_name, retweeter_id);

                if (this.app.storage.autoBookmarkFlag) {
                    // let bookmarkBtn = article.querySelector('[data-testid="bookmark"]');
                    let bookmarkBtn = btn_share.parentNode.querySelector('button[data-testid="bookmark"]');
                    if (bookmarkBtn) {
                        bookmarkBtn.click();
                    }
                }
            };
        }

        let imgs = article.querySelectorAll('a[href*="/photo/"]');
        if (imgs.length > 1) {
            let status_id = article.querySelector('a[href*="/status/"]').href.split('/status/').pop().split('/').shift();
            imgs.forEach(img => {
                let index = img.href.split('/status/').pop().split('/').pop();
                let is_exist = this.app.storage.isDownloaded(status_id);
                let btn_down = document.createElement('div');

                btn_down.innerHTML = `<div><div><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">${Config.svg}</svg></div></div>`;
                btn_down.classList.add('tmd-down', 'tmd-img');
                this.setButtonStatus(btn_down, 'download');
                img.parentNode.appendChild(btn_down);

                btn_down.onclick = e => {
                    e.preventDefault();
                    this.app.handleDownloadClick(btn_down, status_id, is_exist, index, retweeter_name, retweeter_id);

                    if (this.app.storage.autoBookmarkFlag && btn_share) {
                        // let bookmarkBtn = article.querySelector('[data-testid="bookmark"]');
                        let bookmarkBtn = btn_share.parentNode.querySelector('button[data-testid="bookmark"]');
                        if (bookmarkBtn) {
                            bookmarkBtn.click();
                        }
                    }
                };
            });
        }
    }

    addButtonsToMediaList(listitems) {
        listitems.forEach(li => {
            if (li.dataset.tmdDetected === 'true') return;
            let statusLink = li.querySelector('a[href*="/status/"]');
            if (!statusLink || !statusLink.href) return;
            li.dataset.tmdDetected = 'true';

            let status_id = statusLink.href.split('/status/').pop().split(/[\/\?#]/).shift();
            let is_exist = this.app.storage.isDownloaded(status_id);

            let btn_down = document.createElement('div');
            btn_down.innerHTML = `<div><div><svg viewBox="0 0 24 24" style="width: 18px; height: 18px;">${Config.svg}</svg></div></div>`;
            btn_down.classList.add('tmd-down', 'tmd-media');
            this.setButtonStatus(btn_down, is_exist ? 'exist' : 'download', is_exist ? this.lang.completed : this.lang.download);

            li.appendChild(btn_down);
            this.addGifButton(btn_down, gifButton => this.app.handleDownloadClick(
                gifButton, status_id, is_exist, null, 'unknown', 'unknown', { videoGif: true }
            ));
            btn_down.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.app.handleDownloadClick(btn_down, status_id, is_exist);
            };
        });
    }
}


class TwitterMediaDownloaderApp {
    constructor() {
        this.storage = new StorageManager();
        this.ui = new UIManager(this);
        this.queue = new DownloadQueue(details => this.ui.chooseMediaSize(details));
        this.isTweetDeck = location.hostname.includes('tweetdeck');
    }

    async init() {
        await this.storage.init();
        this.ui.injectCSS();
        this.ui.renderHistoryUI();

        document.addEventListener('mouseover', e => {
            let container = e.target.closest('article') || e.target.closest('[role="dialog"]') || e.target.closest('div[aria-labelledby]');
            if (container) window.tmdHoveredContainer = container;
        });

        document.addEventListener('keydown', e => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

            if (this.storage.shortcutKey && e.key.toUpperCase() === this.storage.shortcutKey.toUpperCase()) {
                let container = window.tmdHoveredContainer;

                if (!container || !document.body.contains(container)) {
                    container = document.querySelector('[role="dialog"]') || document.querySelector('article');
                }

                if (container) {
                    let btn = container.querySelector('.tmd-img:hover') || container.querySelector('.tmd-media:hover') || container.querySelector('.tmd-down');

                    if (btn && !btn.classList.contains('loading')) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof btn.onclick === 'function') {
                            btn.onclick(e);
                        } else {
                            btn.click();
                        }
                    }
                }
            }
        });

        new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(node => {
            let article = node.tagName === 'ARTICLE' && node || node.tagName === 'DIV' && (node.querySelector('article') || node.closest('article'));
            if (article) this.ui.addButtonsToArticle(article);
            let listitems = node.tagName === 'LI' && node.getAttribute('role') === 'listitem' && [node] || node.tagName === 'DIV' && node.querySelectorAll('li[role="listitem"]');
            if (listitems) this.ui.addButtonsToMediaList(listitems);
        }))).observe(document.body, { childList: true, subtree: true });
    }

    async handleDownloadClick(btn, status_id, is_exist, index, retweeter_name = 'unknown', retweeter_id = 'unknown', options = {}) {
        if (btn.classList.contains('loading')) return;
        this.ui.setButtonStatus(btn, 'loading');

        let out = this.storage.filenamePattern.split('\n').join('');

        let tweet;
        try {
            tweet = await TwitterAPI.fetchTweetJson(status_id);
        } catch (e) {
            this.ui.setButtonStatus(btn, 'failed', 'API_ERROR');
            return;
        }

        if (!tweet || !tweet.legacy) {
            this.ui.setButtonStatus(btn, 'failed', 'API_ERROR');
            return;
        }

        let user = tweet.core?.user_results?.result?.legacy || { screen_name: 'unknown', name: 'unknown' };
        let invalid = Utils.getInvalidChars();
        let datetime = out.match(/{date-time(-local)?:[^{}]+}/) ? out.match(/{date-time(?:-local)?:([^{}]+)}/)[1].replace(/[\\/|<>*?:"]/g, v => invalid[v] || '') : 'YYYYMMDD-hhmmss';
        let textLength = out.match(/{full-text:(\d+)}/) ? parseInt(out.match(/{full-text:(\d+)}/)[1], 10) : 999;

        let info = {
            'status-id': status_id,
            'user-id': user.screen_name,
            'fav-count': tweet.legacy.favorite_count || 0,
            'user-name': user.name.replace(/[\n\t\\/|<>*?:"]|[\u200b-\u200d\u2060\ufeff]|🔞/g, v => invalid[v] !== undefined ? invalid[v] : ''),
            'date-time': Utils.formatDate(tweet.legacy.created_at, datetime),
            'date-time-local': Utils.formatDate(tweet.legacy.created_at, datetime, true),
            'full-text': (tweet.legacy.full_text || '').replace(/\s*https:\/\/t\.co\/\w+/g, '').replaceAll(/\n+/g, '\n').replace(/[\n\t\\/|<>*?:"]|[\u200b-\u200d\u2060\ufeff]/g, v => invalid[v] !== undefined ? invalid[v] : '').substring(0, textLength),
            'rt-user-name': retweeter_name.replace(/[\n\t\\/|<>*?:"]|[\u200b-\u200d\u2060\ufeff]|🔞/g, v => invalid[v] !== undefined ? invalid[v] : ''),
            'rt-user-id': retweeter_id ? retweeter_id : 'unknown'
        };

        let medias = tweet.legacy.extended_entities?.media || [];
        const allMedias = medias;
        info['media-count'] = medias.length;

        if (index) {
            let idx = parseInt(index, 10) - 1;
            medias = medias[idx] ? [medias[idx]] : [];
        }

        // This explicit action converts videos only; the original button still downloads MP4.
        if (options.videoGif) {
            medias = medias.filter(media => media.type === 'video');
            let error;
            if (!medias.length) {
                error = 'No video to convert / 这条帖子没有可转换的普通视频';
            }
            if (error) {
                this.ui.setButtonStatus(btn, 'failed', error);
                this.ui.showNotice(error);
                return;
            }
        }

        if (medias.length > 0) {
            let tasksLeft = medias.length;
            let hasFailed = false;
            let hasCancelled = false;
            let totalBytes = 0;
            let totalEstimated = false;
            let fetchSizePromises = [];

            const baseInfo = { ...info };
            medias.forEach((media, i) => {
                const info = { ...baseInfo };
                const isVideoGif = options.videoGif && media.type === 'video';
                const isGif = media.type === 'animated_gif' || Boolean(isVideoGif);
                let mp4Variants = media.video_info?.variants?.filter(n => n.content_type === 'video/mp4') || [];
                const gifVariant = media.type === 'animated_gif' && media.video_info?.variants?.find(n => n.content_type === 'image/gif');
                info.url = media.type === 'photo'
                    ? media.media_url_https + ':orig'
                    : (gifVariant?.url || (mp4Variants.length > 0 ? (isGif ? MediaSize.gifVariant(mp4Variants, GifConverter.maxSide) : mp4Variants.reduce((a, b) => (a.bitrate || 0) >= (b.bitrate || 0) ? a : b)).url : (isGif ? null : media.video_info?.variants?.[0]?.url)));

                if (!info.url) {
                    hasFailed = true;
                    tasksLeft--;
                    this.ui.setButtonStatus(btn, 'failed', 'NO_URL');
                    if (options.videoGif) this.ui.showNotice('No MP4 source available / 未找到可转换的 MP4 视频源');
                    return;
                }

                const hasVideoSizes = !isGif && media.type === 'video' && mp4Variants.length > 0;
                let sizePromise = isGif || hasVideoSizes ? Promise.resolve() : fetch(info.url, { method: 'HEAD', signal: AbortSignal.timeout(15000) }).then(res => {
                    let cl = res.headers.get('content-length');
                    if (cl) totalBytes += parseInt(cl, 10);
                }).catch(() => { });
                fetchSizePromises.push(sizePromise);

                info.file = info.url.split('/').pop().split(/[:?]/)[0];
                info['file-name'] = info.file.split('.')[0];
                info['file-ext'] = isGif ? 'gif' : info.file.split('.').pop();
                info['file-type'] = isGif ? 'gif' : media.type;
                info.index = index ? index : allMedias.indexOf(media) + 1;

                const makeFilename = fileInfo => (out.replace(/\.?{file-ext}/, '') + ((medias.length > 1 || index) && !out.includes('{index}') && !out.includes('{file-name}') ? '-' + fileInfo.index : '') + '.{file-ext}')
                    .replace(/{([^{}:]+)(:[^{}]+)?}/g, (_, name) => fileInfo[name] != null ? fileInfo[name] : '');
                info.out = makeFilename(info);
                const chooseSize = details => this.ui.chooseMediaSize({ ...details, name: info.out });

                this.queue.add({
                    url: info.url, name: info.out, gif: isGif,
                    gifOptions: isGif ? {
                        chooseSize,
                        ...(isVideoGif ? { maxSeconds: 15, requireVideo: true,
                            editRange: source => this.ui.editGifRange(source) } : {})
                    } : undefined,
                    videoOptions: hasVideoSizes ? {
                        variants: mp4Variants, duration: Number(media.video_info?.duration_millis) / 1000, chooseSize,
                        nameForUrl: url => {
                            const file = url.split('/').pop().split(/[:?]/)[0];
                            return makeFilename({ ...info, url, file, 'file-name': file.split('.')[0] });
                        }
                    } : undefined,
                    onprogress: text => {
                        if (!hasFailed) {
                            btn.dataset.tmdProgress = text;
                            btn.title = text;
                        }
                    },
                    onload: async (bytes, estimated = false) => {
                        if (isGif || hasVideoSizes) totalBytes += bytes || 0;
                        totalEstimated ||= estimated;
                        if (--tasksLeft === 0 && !hasFailed) {
                            if (hasCancelled) {
                                this.ui.setButtonStatus(btn, 'download', 'Download cancelled / 已取消下载');
                                return;
                            }
                            this.ui.setButtonStatus(btn, 'completed', this.ui.lang.completed);
                            if (this.storage.saveHistoryFlag && !is_exist) {
                                await Promise.all(fetchSizePromises);
                                let sizeStr = totalBytes > 0 ? (totalEstimated ? '≈ ' : '') + (totalBytes / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown';

                                await this.storage.addHistory({
                                    id: status_id,
                                    user: info['user-name'],
                                    type: medias.length > 1 ? 'Gallery' : info['file-type'],
                                    postTime: new Date(tweet.legacy.created_at).getTime(),
                                    thumb: medias[0]?.media_url_https ? medias[0].media_url_https + ':small' : '',
                                    size: sizeStr
                                });
                                this.ui.updateHistoryCount();
                            }
                        }
                    },
                    oncancel: () => {
                        hasCancelled = true;
                        if (--tasksLeft === 0 && !hasFailed) this.ui.setButtonStatus(btn, 'download', 'Download cancelled / 已取消下载');
                    },
                    onerror: error => {
                        hasFailed = true;
                        tasksLeft--;
                        console.error('[TMD] Download failed', error);
                        this.ui.setButtonStatus(btn, 'failed', error?.message || error?.error || 'ERROR');
                        if (options.videoGif) this.ui.showNotice(error?.message || error?.error || 'GIF conversion failed / GIF 转换失败');
                    }
                });
            });
        } else {
            this.ui.setButtonStatus(btn, 'failed', 'MEDIA_NOT_FOUND');
        }
    }
}

new TwitterMediaDownloaderApp().init();
