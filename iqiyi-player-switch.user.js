// ==UserScript==
// @name         iqiyi-player-switch
// @namespace    https://github.com/gooyie/userscript-iqiyi-player-switch
// @homepageURL  https://github.com/gooyie/userscript-iqiyi-player-switch
// @supportURL   https://github.com/gooyie/userscript-iqiyi-player-switch/issues
// @updateURL    https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/iqiyi-player-switch.user.js
// @version      1.9.2
// @description  爱奇艺flash播放器与html5播放器随意切换，改善html5播放器播放体验。
// @author       gooyie
// @license      MIT License
//
// @include      *://*.iqiyi.com/*
// @include      *://v.baidu.com/*
// @include      *://music.baidu.com/mv/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        unsafeWindow
// @connect      qiyi.com
// @require      https://greasyfork.org/scripts/29319-web-streams-polyfill/code/web-streams-polyfill.js?version=191261
// @require      https://greasyfork.org/scripts/29306-fetch-readablestream/code/fetch-readablestream.js?version=191832
// @require      https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/3.3.4/adapter.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.7.0/js/md5.min.js
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const PLAYER_TYPE = {
        Html5VOD: 'h5_VOD',
        FlashVOD: 'flash_VOD'
    };
    /* eslint-disable no-console */
    class Logger {

        static get tag() {
            return `[${GM_info.script.name}]`;
        }

        static log(...args) {
            console.log('%c' + this.tag + '%c' + args.shift(),
                'color: green; font-weight: bolder', 'color: blue', ...args);
        }

        static info(...args) {
            console.info(this.tag + args.shift(), ...args);
        }

        static debug(...args) {
            console.debug(this.tag + args.shift(), ...args);
        }

        static warn(...args) {
            console.warn(this.tag + args.shift(), ...args);
        }

        static error(...args) {
            console.error(this.tag + args.shift(), ...args);
        }

    }
    /* eslint-enable no-console */
    class Cookies {

        static get(key) {
            let value;
            if (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+$').test(key)) { // eslint-disable-line no-control-regex
                let re = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
                let rs = re.exec(document.cookie);
                value = rs ? rs[2] : '';
            }
            return value ? decodeURIComponent(value) : '';
        }

        static set(k, v, o={}) {
            let n = o.expires;
            if ('number' == typeof o.expires) {
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

        static isChrome() {
            return /chrome/i.test(navigator.userAgent);
        }

        static isFirefox() {
            return /firefox/i.test(navigator.userAgent);
        }

        static isEdge() {
            return /edge/i.test(navigator.userAgent);
        }

        static isInnerFrame() {
            return window.top !== window.self;
        }

        static isOutsite() {
            return !/\.iqiyi\.com$/.test(location.host);
        }

        static hasFlashPlugin() {
            const plugins = unsafeWindow.navigator.plugins;
            return !!(plugins['Shockwave Flash'] && plugins['Shockwave Flash'].description);
        }

        static isFullScreen() {
            return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen ||
                document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
        }

    }

    class Hooker {

        static hookCall(cb = ()=>{}) {
            const call = Function.prototype.call;
            Function.prototype.call = function(...args) {
                let ret = call.apply(this, args);
                try {
                    if (args) cb(...args);
                } catch (err) {
                    Logger.error(err.stack);
                }
                return ret;
            };

            Function.prototype.call.toString = Function.prototype.call.toLocaleString = function() {
                return 'function call() { [native code] }';
            };
        }

        static _isFactoryCall(args) { // module.exports, module, module.exports, require
            return args.length === 4 && args[1] instanceof Object && args[1].hasOwnProperty('exports');
        }

        static hookFactoryCall(cb = ()=>{}) {
            this.hookCall((...args) => {if (this._isFactoryCall(args)) cb(...args);});
        }

        static _isJqueryFactoryCall(exports) {
            return exports.hasOwnProperty('fn') && exports.fn.hasOwnProperty('jquery');
        }

        static hookJquery(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isJqueryFactoryCall(args[1].exports)) cb(args[1].exports);});
        }

        static hookJqueryAjax(cb = ()=>{}) {
            this.hookJquery((exports) => {
                const ajax = exports.ajax.bind(exports);

                exports.ajax = function(url, options = {}) {
                    if (typeof url === 'object') {
                        [url, options] = [url.url, url];
                    }

                    let isHijacked = cb(url, options);
                    if (isHijacked) return;

                    return ajax(url, options);
                };
            });
        }

        static _isHttpFactoryCall(exports = {}) {
            return exports.hasOwnProperty('jsonp') && exports.hasOwnProperty('ajax');
        }

        static hookHttp(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isHttpFactoryCall(args[1].exports)) cb(args[1].exports);});
        }

        static hookHttpJsonp(cb = ()=>{}) {
            this.hookHttp((exports) => {
                const jsonp = exports.jsonp.bind(exports);

                exports.jsonp = function(options) {
                    let isHijacked = cb(options);
                    if (isHijacked) return;
                    return jsonp(options);
                };
            });
        }

        static _isLogoFactoryCall(exports = {}) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('showLogo');
        }

        static hookLogo(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isLogoFactoryCall(args[1].exports)) cb(args[1].exports);});
        }

        static _isFullScreenFactoryCall(exports = {}) {
            return exports.__proto__ && exports.__proto__.hasOwnProperty('isFullScreen');
        }

        static hookFullScreen(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isFullScreenFactoryCall(args[1].exports)) cb(args[1].exports);});
        }

        static _isWebFullScreenFactoryCall(exports = {}) {
            return exports.__proto__ && exports.__proto__.hasOwnProperty('isWebFullScreen');
        }

        static hookWebFullScreen(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isWebFullScreenFactoryCall(args[1].exports)) cb(args[1].exports);});
        }

        static hookWebFullScreenInit(cb = ()=>{}) {
            this.hookWebFullScreen((exports) => {
                const init = exports.__proto__.init;
                exports.__proto__.init = function(wrapper, btn) {
                    cb(this, wrapper, btn);
                    init.apply(this, [wrapper, btn]);
                };
            });
        }

        static _isPluginControlsFactoryCall(exports = {}) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('initFullScreen');
        }

        static hookPluginControls(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isPluginControlsFactoryCall(args[1].exports)) cb(args[1].exports);});
        }

        static hookPluginControlsInit(cb = ()=>{}) {
            this.hookPluginControls((exports) => {
                const init = exports.prototype.init;
                exports.prototype.init = function() {
                    cb(this);
                    init.apply(this);
                };
            });
        }

        static hookInitFullScreen(cb = ()=>{}) {
            this.hookPluginControls((exports) => {
                const initFullScreen = exports.prototype.initFullScreen;
                exports.prototype.initFullScreen = function() {
                    cb(this);
                    initFullScreen.apply(this);
                };
            });
        }

        static _isCoreFactoryCall(exports = {}) {
            return 'function' === typeof exports &&
                    exports.prototype.hasOwnProperty('getdefaultvds') &&
                    exports.prototype.hasOwnProperty('getMovieInfo');
        }

        static hookCore(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isCoreFactoryCall(args[1].exports)) cb(args[1].exports);});
        }

        static _isSkinBaseFactoryCall(exports = {}) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('_checkPlugin');
        }

        static hookSkinBase(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isSkinBaseFactoryCall(args[1].exports)) cb(args[1].exports);});
        }

        static _isPluginHotKeysFactoryCall(exports = {}) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('_keydown');
        }

        static hookPluginHotKeys(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isPluginHotKeysFactoryCall(args[1].exports)) cb(args[1].exports);});
        }

        static _isFragmentFactoryCall(exports = {}) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('parseData');
        }

        static hookFragment(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isFragmentFactoryCall(args[1].exports)) cb(args[1].exports);});
        }

        static hookParseData(cb = ()=>{}) {
            this.hookFragment((exports) => {
                const parseData = exports.prototype.parseData;
                exports.prototype.parseData = function(...args) {
                    parseData.apply(this, args);
                    cb(this);
                };
            });
        }

    }

    class Faker {

        static fakeMacPlatform() {
            const PLAFORM_MAC = 'mac';
            Object.defineProperty(unsafeWindow.navigator, 'platform', {get: () => PLAFORM_MAC});
        }

        static fakeSafari() {
            const UA_SAFARY = 'safari';
            Object.defineProperty(unsafeWindow.navigator, 'userAgent', {get: () => UA_SAFARY});
        }

        static fakeChrome() {
            const UA_CHROME = 'chrome';
            Object.defineProperty(unsafeWindow.navigator, 'userAgent', {get: () => UA_CHROME});
        }

        static fakeFlashPlugin() {
            let plugin = {
                description: 'Shockwave Flash 26.0 r0',
                filename: 'pepflashplayer64_26_0_0_131.dll',
                length: 0,
                name: 'Shockwave Flash',
            };

            Reflect.setPrototypeOf(plugin, Plugin.prototype);
            unsafeWindow.navigator.plugins['Shockwave Flash'] = plugin;
        }

        static _calcSign(authcookie) {
            const RESPONSE_KEY = '-0J1d9d^ESd)9jSsja';
            return md5(authcookie.substring(5, 39).split('').reverse().join('') + '<1<' + RESPONSE_KEY);
        }

        static fakeVipRes(authcookie) {
            let json = {
                code: 'A00000',
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
            Cookies.set('P00001', 'faked_passport', {domain: '.iqiyi.com'});
            Logger.log(`faked passport cookie`);
        }

    }

    class Mocker {

        static mock() {
            this.mockForBestDefintion();
            this.mockAd();
            this.mockVip();
            this.mockLogo();
            this.mockCheckPlugin();
        }

        static mockToUseVms() {
            Faker.fakeChrome();
        }

        static mockToUseM3u8() {
            Faker.fakeMacPlatform();
            Faker.fakeSafari();
        }

        static _isVideoReq(url) {
            return /^https?:\/\/(?:\d+.?){4}\/videos\/v.*$/.test(url);
        }

        static mockForBestDefintion() {
            // apply shims
            if (Detector.isFirefox()) {
                const fetch = unsafeWindow.fetch.bind(unsafeWindow);

                unsafeWindow.fetch = (url, opts) => {
                    if (this._isVideoReq(url)) {
                        Logger.log(`fetching stream ${url}`);
                        return fetchStream(url, opts); // xhr with moz-chunked-arraybuffer
                    } else {
                        return fetch(url, opts);
                    }
                };
            } else if (Detector.isEdge()) {
                // export to the global window object
                unsafeWindow.RTCIceCandidate = window.RTCIceCandidate;
                unsafeWindow.RTCPeerConnection = window.RTCPeerConnection;
                unsafeWindow.RTCSessionDescription = window.RTCSessionDescription;
            }
            // auto fall-back
            if (Detector.isSupportVms()) {
                if (!Detector.isChrome()) this.mockToUseVms(); // vms, 1080p or higher
            } else if (Detector.isSupportM3u8()) {
                this.mockToUseM3u8(); // tmts m3u8
            } else {
                // by default, tmts mp4 ...
            }
        }

        static _isAdReq(url) {
            const AD_URL = 'http://t7z.cupid.iqiyi.com/show2';
            return url.indexOf(AD_URL) === 0;
        }

        static mockAd() {
            Hooker.hookJqueryAjax((url, options) => {
                if (this._isAdReq(url)) {
                    let res = Faker.fakeAdRes();
                    (options.complete || options.success)({responseJSON: res}, 'success');
                    Logger.log(`mocked ad request ${url}`);
                    return true;
                }
            });
        }

        static _isCheckVipReq(url) {
            const CHECK_VIP_URL = 'https://cmonitor.iqiyi.com/apis/user/check_vip.action';
            return url === CHECK_VIP_URL;
        }

        static _isLogin() {
            return !!Cookies.get('P00001');
        }

        static mockVip() {
            if (!this._isLogin()) Faker.fakePassportCookie();

            Hooker.hookHttpJsonp((options) => {
                let url = options.url;

                if (this._isCheckVipReq(url)) {
                    let res = Faker.fakeVipRes(options.params.authcookie);
                    options.success(res);
                    Logger.log(`mocked check vip request ${url}`);
                    return true;
                }
            });
        }

        static mockLogo() {
            Hooker.hookLogo(exports => exports.prototype.showLogo = ()=>{});
        }

        static mockCheckPlugin() {
            Hooker.hookSkinBase((exports) => {
                exports.prototype._checkPlugin = () => {};
            });
        }

    }

    class Patcher {

        static _patchWebFullScreen() {
            Hooker.hookWebFullScreenInit((that, wrapper, btn) => {
                btn.on('toggle', that.toggle.bind(that));
            });
        }

        static _patchInitFullScreen() {
            this._patchWebFullScreen();

            Hooker.hookInitFullScreen((that) => {
                that.core.on('togglefullscreen', () => {
                    that._fullscreenBtn.fire('click', {data: null});
                });

                that.core.on('togglewebfullscreen', () => {
                    that._webfullscreenBtn.fire('toggle',  {data: null});
                });
            });
        }

        static _patchPluginControls() {
            Hooker.hookPluginControlsInit((that) => {
                that.core.on('showtip', (event) => {
                    that.setcontroltip.apply(that, [{str: event.data, x: that._process.offset().left, y: 3, cut: true, timeout: true}]);
                    if (that.$plugin.hasClass('process_hidden')) {
                        that._controltips.css('top', '-25px');
                    } else if (that.$plugin.hasClass('bottom-hide')) {
                        that._controltips.css('top', '-38px');
                    }
                });
            });
        }

        static _obtainFlvInfo() {
            Hooker.hookParseData(that => this._flvInfo = that.flvInfo);
        }

        static _patchCore() {
            const self = this;

            this._patchPluginControls();
            this._patchInitFullScreen();
            this._obtainFlvInfo();

            Hooker.hookCore((exports) => {
                exports.prototype._showTip = function(msg) {
                    this.fire({type: 'showtip', data: msg});
                };

                exports.prototype.getFPS = function() {
                    if (self._flvInfo) {
                        return self._flvInfo.videoConfigTag.sps.frame_rate.fps;
                    } else {
                        return 25; // f4v极速以上，动画23.976、电影24、电视剧25。
                    }
                };

                exports.prototype.previousFrame = function() {
                    const video = this.video();
                    let seekTime = Math.max(0, Math.min(this.getDuration(), video.currentTime - 1 / this.getFPS()));
                    video.currentTime = seekTime;
                    this._showTip('上一帧');
                };

                exports.prototype.nextFrame = function() {
                    const video = this.video();
                    let seekTime = Math.max(0, Math.min(this.getDuration(), video.currentTime + 1 / this.getFPS()));
                    video.currentTime = seekTime;
                    this._showTip('下一帧');
                };

                exports.prototype.seek = function(...args) {
                    const video = this.video();
                    const playbackRate = video.playbackRate;
                    this._engine.seek(...args);
                    video.playbackRate = playbackRate;
                };

                exports.prototype.stepSeek = function(stepTime) {
                    let seekTime = Math.max(0, Math.min(this.getDuration(), this.getCurrenttime() + stepTime));
                    let msg;

                    if (Math.abs(stepTime) < 60) {
                        msg = stepTime > 0 ? `步进：${stepTime}秒` : `步退：${Math.abs(stepTime)}秒`;
                    } else {
                        msg = stepTime > 0 ? `步进：${stepTime/60}分钟` : `步退：${Math.abs(stepTime)/60}分钟`;
                    }
                    this._showTip(msg);

                    this.seek(seekTime, true);
                };

                exports.prototype.rangeSeek = function(range) {
                    let duration = this.getDuration();
                    let seekTime = Math.max(0, Math.min(duration, duration * range));
                    this.seek(seekTime, true);
                    this._showTip('定位：' + (range * 100).toFixed(0) + '%');
                };

                exports.prototype.toggleMute = function() {
                    if (this.getMuted()) {
                        this.setMuted(false);
                        this._showTip('取消静音');
                    } else {
                        this.setMuted(true);
                        this._showTip('静音');
                    }
                };

                exports.prototype.adjustVolume = function(value) {
                    let volume = this.getVolume() + value;
                    volume = Math.max(0, Math.min(1, volume.toFixed(2)));
                    this.setVolume(volume);
                    this.fire({type: 'keyvolumechange'});
                };

                exports.prototype.adjustPlaybackRate = function(value) {
                    const video = this.video();
                    let playbackRate = Math.max(0.2, Math.min(5, video.playbackRate + value));
                    video.playbackRate = playbackRate;
                    this._showTip(`播放速率：${playbackRate.toFixed(1).replace(/\.0+$/, '')}`);
                };

                exports.prototype.resetPlaybackRate = function() {
                    const video = this.video();
                    video.playbackRate = 1;
                    this._showTip('恢复播放速率');
                };

                exports.prototype.hasPreVideo = function() {
                    return this._getVideoIndexInList(this._movieinfo.tvid) > 0 || this._getVideoIndexInList(this._movieinfo.oldTvid) > 0;
                };

                exports.prototype.playNext = function() {
                    if (this.hasNextVideo()) {
                        this._showTip('播放下一集');
                        this.switchNextVideo();
                    } else {
                        this._showTip('没有下一集哦');
                    }
                };

                exports.prototype.playPre = function() {
                    if (this.hasPreVideo()) {
                        this._showTip('播放上一集');
                        this.switchPreVideo();
                    } else {
                        this._showTip('没有上一集哦');
                    }
                };
            });
        }

        static _patchKeyShortcuts() {
            Hooker.hookPluginHotKeys((exports) => {
                exports.prototype.init = function() {
                    document.addEventListener('keydown', this._keydown.bind(this));
                };

                exports.prototype._isValidTarget = function(target) {
                    return target.nodeName === 'BODY' || target.nodeName == 'VIDEO' || target.classList.contains('pw-video'); // 全局
                    // return target.nodeName === 'VIDEO' || target.classList.contains('pw-video'); // 非全局
                };

                exports.prototype._keydown = function(event) {
                    if (!this._isValidTarget(event.target)) return;

                    switch (event.keyCode) {
                    case 32: // Spacebar
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            if (this.core.isPaused()) {
                                this.core.play(true);
                                this.core._showTip('播放');
                            } else {
                                this.core.pause(true);
                                this.core._showTip('暂停');
                            }
                        } else {
                            return;
                        }
                        break;
                    case 39:    // → Arrow Right
                    case 37: {  // ← Arrow Left
                        let stepTime;
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            stepTime = 39 === event.keyCode ? 5 : -5;
                        } else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
                            stepTime = 39 === event.keyCode ? 30 : -30;
                        } else if (!event.ctrlKey && event.shiftKey && !event.altKey) {
                            stepTime = 39 === event.keyCode ? 60 : -60;
                        } else if (event.ctrlKey && !event.shiftKey && event.altKey) {
                            stepTime = 39 === event.keyCode ? 3e2 : -3e2; // 5分钟
                        } else {
                            return;
                        }

                        this.core.stepSeek(stepTime);
                        break;
                    }
                    case 38: // ↑ Arrow Up
                    case 40: // ↓ Arrow Down
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this.core.adjustVolume(38 === event.keyCode ? 0.05 : -0.05);
                        } else {
                            return;
                        }
                        break;
                    case 77: // M
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this.core.toggleMute();
                        } else {
                            return;
                        }
                        break;
                    case 13: // Enter
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this.core.fire({type: 'togglefullscreen'});
                        } else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this.core.fire({type: 'togglewebfullscreen'});
                        } else {
                            return;
                        }
                        break;
                    case 67: // C
                    case 88: // X
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this.core.adjustPlaybackRate(67 === event.keyCode ? 0.1 : -0.1);
                        } else {
                            return;
                        }
                        break;
                    case 90: // Z
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this.core.resetPlaybackRate();
                        } else {
                            return;
                        }
                        break;
                    case 68: // D
                    case 70: // F
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this.core.pause(true);
                            if (event.keyCode === 68) {
                                this.core.previousFrame();
                            } else {
                                this.core.nextFrame();
                            }
                        } else {
                            return;
                        }
                        break;
                    case 80: // P
                    case 78: // N
                        if (!event.ctrlKey && event.shiftKey && !event.altKey) {
                            if (event.keyCode === 78) {
                                this.core.playNext();
                            } else {
                                this.core.playPre();
                            }
                        } else {
                            return;
                        }
                        break;
                    default:
                        if (event.keyCode >= 48 && event.keyCode <= 57) { // 0 ~ 9
                            if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                                this.core.rangeSeek((event.keyCode - 48) * 0.1);
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    }

                    event.preventDefault();
                    event.stopPropagation();
                };

                Logger.log('添加键盘快捷键');
            });
        }

        static _patchMouseShortcuts() {
            Hooker.hookPluginControlsInit((that) => {
                document.addEventListener('wheel', (event) => {
                    if (!Detector.isFullScreen()) return;

                    let delta = event.wheelDelta || event.detail || (event.deltaY && -event.deltaY);
                    that.core.adjustVolume(delta > 0 ? 0.05 : -0.05);
                });

                Logger.log('添加鼠标快捷键');
            });
        }

        static patchShortcuts() {
            this._patchCore();

            this._patchKeyShortcuts();
            this._patchMouseShortcuts();
        }

    }

    class Switcher {

        static switchTo(toType) {
            Logger.log(`switching to ${toType} ...`);

            GM_setValue('player_forcedType', toType);
            document.location.reload();
        }

    }

    class Finder {

        static findVid(text) {
            let result = /vid=([\da-z]+)/i.exec(text);
            return result ? result[1] : null;
        }

        static findTvid(text) {
            let result = /tvid=(\d+)/i.exec(text);
            return result ? result[1] : null;
        }

        static findEmbedNodes() {
            let nodes = document.querySelectorAll('object, embed');
            return nodes.length > 0 ? nodes : null;
        }

    }

    function getVideoUrl(tvid, vid) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: `http://cache.video.qiyi.com/jp/vi/${tvid}/${vid}/?callback=callback`,
                method: 'GET',
                timeout: 8e3,
                onload: (details) => {
                    try {
                        let json = JSON.parse(/callback\s*\(\s*(\{.*\})\s*\)/.exec(details.responseText)[1]);
                        resolve(json.vu);
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: reject,
                onabort: reject,
                ontimeout: reject
            });
        });
    }

    function embedSrc(targetNode, {tvid, vid}) {
        targetNode.innerHTML = `<div class="${GM_info.script.name} info">正在获取视频源...</div>`;

        getVideoUrl(tvid, vid).then((url) => {
            Logger.log('origin url: %s', url);
            targetNode.innerHTML = `<iframe id="innerFrame" src="${url}" frameborder="0" allowfullscreen="true" width="100%" height="100%"></iframe>`;
        }).catch((err) => {
            targetNode.innerHTML = `<div class="${GM_info.script.name} error"><p>获取视频源出错！</p><p>${err.message}</p></div>`;
        });
    }

    function replaceFlash() {
        const observer = new MutationObserver((records, self) => {
            for (let record of records) {
                if (record.type !== 'childList' || !record.addedNodes) continue;

                for (let node of record.addedNodes) {
                    if (node.nodeName !== 'OBJECT' && node.nodeName !== 'EMBED') continue;
                    Logger.log('finded node', node);

                    let text = node.outerHTML;
                    let vid = Finder.findVid(text);
                    let tvid = Finder.findTvid(text);

                    if (tvid && vid) {
                        Logger.log('finded tvid: %s, vid: %s', tvid, vid);
                        embedSrc(node.parentNode, {tvid, vid});
                        self.disconnect();
                        Logger.log('stoped observation');
                    }
                }
            }
        });

        observer.observe(document.body || document.documentElement, {subtree: true, childList: true});
        Logger.log('started observation');
    }

    function adaptIframe() {
        let style = `
            body[class|="qypage"] {
                overflow: hidden !important;
                background: #000 !important;
                visibility: hidden;
            }

            .mod-func {
                display: none !important;
            }

            .${GM_info.script.name}.info {
                width: 20em;
                height: 5em;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                text-align: center;
                line-height: 5em;
                font-size: 1em;
                color: #ccc;
            }

            .${GM_info.script.name}.error {
                height: 3em;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                text-align: center;
                font-size: 1em;
                color: #c00;
            }
        `;

        GM_addStyle(style);

        Hooker.hookWebFullScreen((exports) => {
            const init = exports.__proto__.init;
            exports.__proto__.init = function(wrapper, btn) {
                init.apply(this, [wrapper, btn]);
                this.enter();

                btn[0].style.display = 'none';
                document.body.style.visibility = 'visible';
            };

            exports.__proto__.exit = () => {};
        });

        Hooker.hookCore((exports) => {
            exports.prototype.hasNextVideo = () => null;
        });
    }

    function forceHtml5() {
        Logger.log(`setting player_forcedType cookie as ${PLAYER_TYPE.Html5VOD}`);
        Cookies.set('player_forcedType', PLAYER_TYPE.Html5VOD, {domain: '.iqiyi.com'});
    }

    function forceFlash() {
        Logger.log(`setting player_forcedType cookie as ${PLAYER_TYPE.FlashVOD}`);
        Cookies.set('player_forcedType', PLAYER_TYPE.FlashVOD, {domain: '.iqiyi.com'});
    }

    function clean() {
        Cookies.remove('player_forcedType', {domain: '.iqiyi.com'});
        if (Cookies.get('P00001') === 'faked_passport') Cookies.remove('P00001', {domain: '.iqiyi.com'});
        Logger.log(`removed cookies.`);
    }

    function registerMenu() {
        const MENU_NAME = {
            HTML5: 'HTML5播放器',
            FLASH: 'Flash播放器'
        };

        let currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD); // 默认为Html5播放器，免去切换。
        let [toType, name] = currType === PLAYER_TYPE.Html5VOD ? [PLAYER_TYPE.FlashVOD, MENU_NAME.FLASH] : [PLAYER_TYPE.Html5VOD, MENU_NAME.HTML5];
        GM_registerMenuCommand(name, () => Switcher.switchTo(toType), null);
        Logger.log(`registered menu.`);
    }

//=============================================================================

    registerMenu();

    let currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD);
    if (currType === PLAYER_TYPE.Html5VOD) {
        if (!Detector.isSupportHtml5()) {
            alert('╮(╯▽╰)╭ 你的浏览器播放不了html5视频~~~~');
            return;
        }

        forceHtml5();
        Mocker.mock();
        Patcher.patchShortcuts();

        if (Detector.isInnerFrame()) adaptIframe();
        if (Detector.isOutsite()) {
            if (!Detector.hasFlashPlugin()) Faker.fakeFlashPlugin();
            replaceFlash();
        }
    } else {
        forceFlash();
    }

    window.addEventListener('unload', () => clean());

})();
