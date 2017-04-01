// ==UserScript==
// @name         iqiyi player switch
// @namespace    https://greasyfork.org/users/111819-gooyie
// @version      0.1.0
// @description  iqiyi player switch between flash and html5
// @author       gooyie
// @license      MIT License
//
// @include      *://www.iqiyi.com/v_*
// @include      *://www.iqiyi.com/w_*
// @include      *://www.iqiyi.com/dongman/*/*
// @include      *://www.iqiyi.com/yinyue/*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_log
// @run-at       document-start

// ==/UserScript==

(function() {
    'use strict';

    // ua
    const UA_CHROME = 'chrome';
    const UA_SAFARY = 'safari';
    // platform
    const PLAFORM_MAC = 'mac';

    const PLAYER_TYPE = {
        Html5VOD: "h5_VOD",
        FlashVOD: "flash_VOD"
    };

    class DocCookies {
        static get(key) {
            let value;
            if (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+$').test(key)) {
                let re = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
                let rs = re.exec(document.cookie);
                value = rs ? rs[2] : '';
            }
            return value ? decodeURIComponent(value) : '';
        }

        static set(k, v, o={}) {
            let n = o.expires;
            if ("number" == typeof o.expires) {
                n = new Date();
                n.setTime(n.getTime() + o.expires);
            }
            let key = k;
            let value = encodeURIComponent(v);
            let path = o.path ? '; path=' + o.path : '';
            let expires = n ? '; expires=' + n.toGMTString() : '';
            let domain = o.domain ? '; domain=' + o.domain : '';
            document.cookie = `${key}=${value}${path}${expires}${domain}`;
        }

        static remove(k, o={}) {
            o.expires = new Date(0);
            this.set(k, '', o);
        }
    }

    class Switcher {
        static switch() {
            let currType = DocCookies.get('player_forcedType');
            let toType = currType === PLAYER_TYPE.Html5VOD ? PLAYER_TYPE.FlashVOD : PLAYER_TYPE.Html5VOD;

            GM_log('switching to %s ...', toType);
            if (!confirm(`刷新页面切换到${toType}播放器？`)) return;

            if (toType === PLAYER_TYPE.Html5VOD && !this._canPlayback()) {
                alert('╮(╯▽╰)╭ 你的浏览器播放不了html5视频~~~~');
                return;
            }
            // cookie 有效时间为一年
            let date = new Date();
            date.setFullYear(date.getFullYear() + 1);

            DocCookies.set('player_forcedType', toType, {expires: date});
            document.location.reload();
        }

        static _canPlayback() {
            let v = document.createElement('video');
            return !!(
                v.canPlayType('audio/mp4; codecs="mp4a.40.2"') &&
                v.canPlayType('video/mp4; codecs="avc1.640029"') &&
                v.canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.2"')
            );
        }

    }
    // TODO: polyfill使不同的浏览器都能使用vms
    class Mocker {
        static mock() {
            let currType = DocCookies.get('player_forcedType');
            if (currType !== PLAYER_TYPE.Html5VOD) return;

            if (this._canUseVms()) {
                // 使用 vms
                this._fakeMacPlatform();
                this._fakeChrome();
            } else if (this._canUseM3u8()) {
                // 使用 tmts m3u8
                this._fakeMacPlatform();
                this._fakeSafary();
            }
            // 默认使用 tmts mp4 ...
        }

        static _fakeMacPlatform() {
            Object.defineProperty(navigator, 'platform', {get: () => PLAFORM_MAC});
        }

        static _fakeSafary() {
            Object.defineProperty(navigator, 'userAgent', {get: () => UA_SAFARY});
        }

        static _fakeChrome() {
            Object.defineProperty(navigator, 'userAgent', {get: () => UA_CHROME});
        }

        static _canUseVms() {
            return !!(
                window.MediaSource && window.URL && window.WebSocket && window.ReadableStream &&
                (window.RTCSessionDescription || window.webkitRTCSessionDescription) &&
                (window.RTCPeerConnection || window.webkitRTCPeerConnection) &&
                (window.RTCIceCandidate || window.webkitRTCIceCandidate)
            );
        }

        static _canUseM3u8() {
            let v = document.createElement('video');
            return !!(
                v.canPlayType('application/x-mpegurl') &&
                v.canPlayType('application/vnd.apple.mpegurl')
            );
        }
    }


    GM_registerMenuCommand('Switch Player', () => Switcher.switch(), null);

    Mocker.mock();

})();
