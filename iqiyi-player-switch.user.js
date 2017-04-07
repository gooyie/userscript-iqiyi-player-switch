// ==UserScript==
// @name         iqiyi player switch
// @namespace    https://github.com/gooyie/userscript-iqiyi-player-switch
// @homepageURL  https://github.com/gooyie/userscript-iqiyi-player-switch
// @supportURL   https://github.com/gooyie/userscript-iqiyi-player-switch/issues
// @updateURL    https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/iqiyi-player-switch.user.js
// @version      1.3.0
// @description  iqiyi player switch between flash and html5
// @author       gooyie
// @license      MIT License
//
// @include      *://*.iqiyi.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_log
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.7.0/js/md5.min.js
// @run-at       document-start

// ==/UserScript==

(function() {
    'use strict';

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

    class Detector {

        static isSupportHtml5() {
            let v = document.createElement('video');
            return !!(
                v.canPlayType('audio/mp4; codecs="mp4a.40.2"') &&
                v.canPlayType('video/mp4; codecs="avc1.640029"') &&
                v.canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.2"')
            );
        }

        static isSupportVms() {
            return !!(
                window.MediaSource && window.URL && window.WebSocket && window.ReadableStream &&
                (window.RTCSessionDescription || window.webkitRTCSessionDescription) &&
                (window.RTCPeerConnection || window.webkitRTCPeerConnection) &&
                (window.RTCIceCandidate || window.webkitRTCIceCandidate)
            );
        }

        static isSupportM3u8() {
            let v = document.createElement('video');
            return !!(
                v.canPlayType('application/x-mpegurl') &&
                v.canPlayType('application/vnd.apple.mpegurl')
            );
        }

    }

    class Hooker {

        static hookCall(cb = () => {}) {

            const call = Function.prototype.call;
            Function.prototype.call = function(...args) {
                let ret = call.bind(this)(...args);
                if (args) cb(...args);
                return ret;
            };

            Function.prototype.call.toString = Function.prototype.call.toLocaleString = function() {
                return 'function call() { [native code] }';
            };

        }

        static _isFactoryCall(args) { // module.exports, module, module.exports, require
            return args.length === 4 && 'object' === typeof args[1] && args[1].hasOwnProperty('exports');
        }

        static hookFactoryCall(cb = () => {}) {
            this.hookCall((...args) => {if (this._isFactoryCall(args)) cb(...args);});
        }

        static _isJqueryFactoryCall(exports) {
            return exports.hasOwnProperty('fn') && exports.fn.hasOwnProperty('jquery');
        }

        static hookJquery(cb = () => {}) {
            this.hookFactoryCall((...args) => {if (this._isJqueryFactoryCall(args[1].exports)) cb(...args);});
        }

        static hookJqueryAjax(cb = () => {}) {
            this.hookJquery((...args) => {
                let exports = args[1].exports;

                const ajax = exports.ajax.bind(exports);

                exports.ajax = function(url, options = {}) {
                    if (typeof url === 'object') {
                        [url, options] = [url.url, url];
                    }

                    let isHijacked = cb(url, options);
                    if (isHijacked) return;

                    ajax(url, options);
                };
            });
        }

        static _isHttpFactoryCall(exports) {
            return exports.hasOwnProperty('jsonp') && exports.hasOwnProperty('ajax');
        }

        static hookHttp(cb = () => {}) {
            this.hookFactoryCall((...args) => {if (this._isHttpFactoryCall(args[1].exports)) cb(...args);});
        }

        static hookHttpJsonp(cb = () => {}) {
            this.hookHttp((...args) => {
                let exports = args[1].exports;

                const jsonp = exports.jsonp.bind(exports);

                exports.jsonp = function(options) {
                    let isHijacked = cb(options);
                    if (isHijacked) return;
                    jsonp(options);
                };
            });
        }

    }

    class Faker {

        static fakeMacPlatform() {
            const PLAFORM_MAC = 'mac';
            Object.defineProperty(navigator, 'platform', {get: () => PLAFORM_MAC});
        }

        static fakeSafary() {
            const UA_SAFARY = 'safari';
            Object.defineProperty(navigator, 'userAgent', {get: () => UA_SAFARY});
        }

        static fakeChrome() {
            const UA_CHROME = 'chrome';
            Object.defineProperty(navigator, 'userAgent', {get: () => UA_CHROME});
        }

        static _calcSign(authcookie) {
            const RESPONSE_KEY = '-0J1d9d^ESd)9jSsja';
            return md5(authcookie.substring(5, 39).split("").reverse().join("") + "<1<" + RESPONSE_KEY);
        }

        static fakeVipRes(authcookie) {
            let json = {
                code: "A00000",
                data: {
                    sign: this._calcSign(authcookie)
                }
            };
            return json;
        }

        static fakeAdRes() {
            let json = {};
            return json;
        }

        static fakePassportCookie() {
            DocCookies.set('P00001', 'faked_passport', {domain: '.iqiyi.com'});
        }

    }

    class Mocker {

        static mock() {
            let currType = DocCookies.get('player_forcedType');
            if (currType !== PLAYER_TYPE.Html5VOD) return;

            this.mockForBestDefintion();
            this.mockAd();
            this.mockVip();
        }

        static mockToUseVms() {
            Faker.fakeMacPlatform();
            Faker.fakeChrome();
        }

        static mockToUseM3u8() {
            Faker.fakeMacPlatform();
            Faker.fakeSafary();
        }

        static mockForBestDefintion() {
            if (Detector.isSupportVms()) {
                this.mockToUseVms(); // vms, 1080p or higher
            } else if (Detector.isSupportM3u8()) {
                this.mockToUseM3u8(); // tmts m3u8
            }
            // tmts mp4 ...
        }

        static _isAdReq(url) {
            const AD_URL = 'http://t7z.cupid.iqiyi.com/show2';
            return url.indexOf(AD_URL) === 0;
        }

        static mockAd() {
            Hooker.hookJqueryAjax((url, options) => {
                GM_log('[jquery ajax]: %s', url);

                if (this._isAdReq(url)) {
                    let res = Faker.fakeAdRes();
                    options.complete({responseJSON: res}, 'success');
                    return true;
                }
            });
        }

        static _isCheckVipReq(url) {
            const CHECK_VIP_URL = 'https://cmonitor.iqiyi.com/apis/user/check_vip.action';
            return url === CHECK_VIP_URL;
        }

        static _isLogin() {
            return !!DocCookies.get('P00001');
        }

        static mockVip() {
            if (!this._isLogin()) Faker.fakePassportCookie();

            Hooker.hookHttpJsonp((options) => {
                let url = options.url;
                GM_log('[http jsonp]: %s', url);

                if (this._isCheckVipReq(url)) {
                    let res = Faker.fakeVipRes(options.params.authcookie);
                    options.success(res);
                    return true;
                }
            });
        }

    }

    class Switcher {

        static switchTo(toType) {
            GM_log('switching to %s ...', toType);

            if (toType === PLAYER_TYPE.Html5VOD && !Detector.isSupportHtml5()) {
                alert('╮(╯▽╰)╭ 你的浏览器播放不了html5视频~~~~');
                return;
            }
            // cookie 有效时间为一年
            let date = new Date();
            date.setFullYear(date.getFullYear() + 1);

            DocCookies.set('player_forcedType', toType, {domian: '.iqiyi.com', expires: date});
            document.location.reload();
        }

    }

    function registerMenu() {
        const MENU_NAME = {
            HTML5: 'HTML5播放器',
            FLASH: 'Flash播放器'
        };

        let currType = DocCookies.get('player_forcedType');
        let [toType, name] = currType === PLAYER_TYPE.Html5VOD ? [PLAYER_TYPE.FlashVOD, MENU_NAME.FLASH] : [PLAYER_TYPE.Html5VOD, MENU_NAME.HTML5];
        GM_registerMenuCommand(name, () => Switcher.switchTo(toType), null);
    }


    registerMenu();
    Mocker.mock();

})();
