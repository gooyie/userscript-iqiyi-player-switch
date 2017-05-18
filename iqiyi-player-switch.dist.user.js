'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==UserScript==
// @name         iqiyi player switch
// @namespace    https://github.com/gooyie/userscript-iqiyi-player-switch
// @homepageURL  https://github.com/gooyie/userscript-iqiyi-player-switch
// @supportURL   https://github.com/gooyie/userscript-iqiyi-player-switch/issues
// @updateURL    https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/iqiyi-player-switch.user.js
// @version      1.7.0
// @description  iqiyi player switch between flash and html5
// @author       gooyie
// @license      MIT License
//
// @include      *://*.iqiyi.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_log
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/29319-web-streams-polyfill/code/web-streams-polyfill.js?version=191261
// @require      https://greasyfork.org/scripts/29306-fetch-readablestream/code/fetch-readablestream.js?version=191832
// @require      https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/3.3.4/adapter.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.7.0/js/md5.min.js
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    var PLAYER_TYPE = {
        Html5VOD: 'h5_VOD',
        FlashVOD: 'flash_VOD'
    };

    var Logger = function () {
        function Logger() {
            _classCallCheck(this, Logger);
        }

        _createClass(Logger, null, [{
            key: 'log',
            value: function log(msg) {
                GM_log(this.tag + msg);
            }
        }, {
            key: 'tag',
            get: function get() {
                return '[' + GM_info.script.name + ']: ';
            }
        }]);

        return Logger;
    }();

    var Cookies = function () {
        function Cookies() {
            _classCallCheck(this, Cookies);
        }

        _createClass(Cookies, null, [{
            key: 'get',
            value: function get(key) {
                var value = void 0;
                if (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+$').test(key)) {
                    var re = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
                    var rs = re.exec(document.cookie);
                    value = rs ? rs[2] : '';
                }
                return value ? decodeURIComponent(value) : '';
            }
        }, {
            key: 'set',
            value: function set(k, v) {
                var o = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                var n = o.expires;
                if ('number' == typeof o.expires) {
                    n = new Date();
                    n.setTime(n.getTime() + o.expires);
                }
                var key = k;
                var value = encodeURIComponent(v);
                var path = o.path ? '; path=' + o.path : '';
                var expires = n ? '; expires=' + n.toGMTString() : '';
                var domain = o.domain ? '; domain=' + o.domain : '';
                document.cookie = key + '=' + value + path + expires + domain;
            }
        }, {
            key: 'remove',
            value: function remove(k) {
                var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                o.expires = new Date(0);
                this.set(k, '', o);
            }
        }]);

        return Cookies;
    }();

    var Detector = function () {
        function Detector() {
            _classCallCheck(this, Detector);
        }

        _createClass(Detector, null, [{
            key: 'isSupportHtml5',
            value: function isSupportHtml5() {
                var v = document.createElement('video');
                return !!(v.canPlayType('audio/mp4; codecs="mp4a.40.2"') && v.canPlayType('video/mp4; codecs="avc1.640029"') && v.canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.2"'));
            }
        }, {
            key: 'isSupportVms',
            value: function isSupportVms() {
                return !!(window.MediaSource && window.URL && window.WebSocket && window.ReadableStream && (window.RTCSessionDescription || window.webkitRTCSessionDescription) && (window.RTCPeerConnection || window.webkitRTCPeerConnection) && (window.RTCIceCandidate || window.webkitRTCIceCandidate));
            }
        }, {
            key: 'isSupportM3u8',
            value: function isSupportM3u8() {
                var v = document.createElement('video');
                return !!(v.canPlayType('application/x-mpegurl') && v.canPlayType('application/vnd.apple.mpegurl'));
            }
        }, {
            key: 'isChrome',
            value: function isChrome() {
                return (/chrome/i.test(navigator.userAgent)
                );
            }
        }, {
            key: 'isFirefox',
            value: function isFirefox() {
                return (/firefox/i.test(navigator.userAgent)
                );
            }
        }, {
            key: 'isEdge',
            value: function isEdge() {
                return (/edge/i.test(navigator.userAgent)
                );
            }
        }]);

        return Detector;
    }();

    var Hooker = function () {
        function Hooker() {
            _classCallCheck(this, Hooker);
        }

        _createClass(Hooker, null, [{
            key: 'hookCall',
            value: function hookCall() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};


                var call = Function.prototype.call;
                Function.prototype.call = function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    var ret = call.bind(this).apply(undefined, args);
                    if (args) cb.apply(undefined, args);
                    return ret;
                };

                Function.prototype.call.toString = Function.prototype.call.toLocaleString = function () {
                    return 'function call() { [native code] }';
                };
            }
        }, {
            key: '_isFactoryCall',
            value: function _isFactoryCall(args) {
                // module.exports, module, module.exports, require
                return args.length === 4 && 'object' === _typeof(args[1]) && args[1].hasOwnProperty('exports');
            }
        }, {
            key: 'hookFactoryCall',
            value: function hookFactoryCall() {
                var _this = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookCall(function () {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    if (_this._isFactoryCall(args)) cb.apply(undefined, args);
                });
            }
        }, {
            key: '_isJqueryFactoryCall',
            value: function _isJqueryFactoryCall(exports) {
                return exports.hasOwnProperty('fn') && exports.fn.hasOwnProperty('jquery');
            }
        }, {
            key: 'hookJquery',
            value: function hookJquery() {
                var _this2 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        args[_key3] = arguments[_key3];
                    }

                    if (_this2._isJqueryFactoryCall(args[1].exports)) cb.apply(undefined, args);
                });
            }
        }, {
            key: 'hookJqueryAjax',
            value: function hookJqueryAjax() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookJquery(function () {
                    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                        args[_key4] = arguments[_key4];
                    }

                    var exports = args[1].exports;

                    var ajax = exports.ajax.bind(exports);

                    exports.ajax = function (url) {
                        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                        if ((typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object') {
                            var _ref = [url.url, url];
                            url = _ref[0];
                            options = _ref[1];
                        }

                        var isHijacked = cb(url, options);
                        if (isHijacked) return;

                        return ajax(url, options);
                    };
                });
            }
        }, {
            key: '_isHttpFactoryCall',
            value: function _isHttpFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return exports.hasOwnProperty('jsonp') && exports.hasOwnProperty('ajax');
            }
        }, {
            key: 'hookHttp',
            value: function hookHttp() {
                var _this3 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                        args[_key5] = arguments[_key5];
                    }

                    if (_this3._isHttpFactoryCall(args[1].exports)) cb.apply(undefined, args);
                });
            }
        }, {
            key: 'hookHttpJsonp',
            value: function hookHttpJsonp() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookHttp(function () {
                    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                        args[_key6] = arguments[_key6];
                    }

                    var exports = args[1].exports;

                    var jsonp = exports.jsonp.bind(exports);

                    exports.jsonp = function (options) {
                        var isHijacked = cb(options);
                        if (isHijacked) return;
                        return jsonp(options);
                    };
                });
            }
        }, {
            key: '_isLogoFactoryCall',
            value: function _isLogoFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return 'function' === typeof exports && exports.prototype.hasOwnProperty('showLogo');
            }
        }, {
            key: 'hookLogo',
            value: function hookLogo() {
                var _this4 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                        args[_key7] = arguments[_key7];
                    }

                    if (_this4._isLogoFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }]);

        return Hooker;
    }();

    var Faker = function () {
        function Faker() {
            _classCallCheck(this, Faker);
        }

        _createClass(Faker, null, [{
            key: 'fakeMacPlatform',
            value: function fakeMacPlatform() {
                var PLAFORM_MAC = 'mac';
                Object.defineProperty(unsafeWindow.navigator, 'platform', { get: function get() {
                        return PLAFORM_MAC;
                    } });
            }
        }, {
            key: 'fakeSafari',
            value: function fakeSafari() {
                var UA_SAFARY = 'safari';
                Object.defineProperty(unsafeWindow.navigator, 'userAgent', { get: function get() {
                        return UA_SAFARY;
                    } });
            }
        }, {
            key: 'fakeChrome',
            value: function fakeChrome() {
                var UA_CHROME = 'chrome';
                Object.defineProperty(unsafeWindow.navigator, 'userAgent', { get: function get() {
                        return UA_CHROME;
                    } });
            }
        }, {
            key: '_calcSign',
            value: function _calcSign(authcookie) {
                var RESPONSE_KEY = '-0J1d9d^ESd)9jSsja';
                return md5(authcookie.substring(5, 39).split('').reverse().join('') + '<1<' + RESPONSE_KEY);
            }
        }, {
            key: 'fakeVipRes',
            value: function fakeVipRes(authcookie) {
                var json = {
                    code: 'A00000',
                    data: {
                        sign: this._calcSign(authcookie)
                    }
                };
                return json;
            }
        }, {
            key: 'fakeAdRes',
            value: function fakeAdRes() {
                var json = {};
                return json;
            }
        }, {
            key: 'fakePassportCookie',
            value: function fakePassportCookie() {
                Cookies.set('P00001', 'faked_passport', { domain: '.iqiyi.com' });
                Logger.log('faked passport cookie');
            }
        }]);

        return Faker;
    }();

    var Mocker = function () {
        function Mocker() {
            _classCallCheck(this, Mocker);
        }

        _createClass(Mocker, null, [{
            key: 'mock',
            value: function mock() {
                var _this5 = this;

                var currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD);

                if (currType === PLAYER_TYPE.Html5VOD) {
                    if (!Detector.isSupportHtml5()) {
                        alert('╮(╯▽╰)╭ 你的浏览器播放不了html5视频~~~~');
                        return;
                    }

                    this.forceHtml5();
                    this.mockForBestDefintion();
                    this.mockAd();
                    this.mockVip();
                    this.mockLogo();
                } else {
                    this.forceFlash();
                }

                window.addEventListener('unload', function (event) {
                    return _this5.destroy();
                });
            }
        }, {
            key: 'forceHtml5',
            value: function forceHtml5() {
                Logger.log('setting player_forcedType cookie as ' + PLAYER_TYPE.Html5VOD);
                Cookies.set('player_forcedType', PLAYER_TYPE.Html5VOD, { domain: '.iqiyi.com' });
            }
        }, {
            key: 'forceFlash',
            value: function forceFlash() {
                Logger.log('setting player_forcedType cookie as ' + PLAYER_TYPE.FlashVOD);
                Cookies.set('player_forcedType', PLAYER_TYPE.FlashVOD, { domain: '.iqiyi.com' });
            }
        }, {
            key: 'mockToUseVms',
            value: function mockToUseVms() {
                Faker.fakeChrome();
            }
        }, {
            key: 'mockToUseM3u8',
            value: function mockToUseM3u8() {
                Faker.fakeMacPlatform();
                Faker.fakeSafari();
            }
        }, {
            key: '_isVideoReq',
            value: function _isVideoReq(url) {
                return (/^https?:\/\/(?:\d+.?){4}\/videos\/v.*$/.test(url)
                );
            }
        }, {
            key: 'mockForBestDefintion',
            value: function mockForBestDefintion() {
                var _this6 = this;

                // apply shims
                if (Detector.isFirefox()) {
                    var fetch = unsafeWindow.fetch.bind(unsafeWindow);

                    unsafeWindow.fetch = function (url, opts) {
                        if (_this6._isVideoReq(url)) {
                            Logger.log('fetching stream ' + url);
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
        }, {
            key: '_isAdReq',
            value: function _isAdReq(url) {
                var AD_URL = 'http://t7z.cupid.iqiyi.com/show2';
                return url.indexOf(AD_URL) === 0;
            }
        }, {
            key: 'mockAd',
            value: function mockAd() {
                var _this7 = this;

                Hooker.hookJqueryAjax(function (url, options) {
                    if (_this7._isAdReq(url)) {
                        var res = Faker.fakeAdRes();
                        (options.complete || options.success)({ responseJSON: res }, 'success');
                        Logger.log('mocked ad request ' + url);
                        return true;
                    }
                });
            }
        }, {
            key: '_isCheckVipReq',
            value: function _isCheckVipReq(url) {
                var CHECK_VIP_URL = 'https://cmonitor.iqiyi.com/apis/user/check_vip.action';
                return url === CHECK_VIP_URL;
            }
        }, {
            key: '_isLogin',
            value: function _isLogin() {
                return !!Cookies.get('P00001');
            }
        }, {
            key: 'mockVip',
            value: function mockVip() {
                var _this8 = this;

                if (!this._isLogin()) Faker.fakePassportCookie();

                Hooker.hookHttpJsonp(function (options) {
                    var url = options.url;

                    if (_this8._isCheckVipReq(url)) {
                        var res = Faker.fakeVipRes(options.params.authcookie);
                        options.success(res);
                        Logger.log('mocked check vip request ' + url);
                        return true;
                    }
                });
            }
        }, {
            key: 'mockLogo',
            value: function mockLogo() {
                Hooker.hookLogo(function (exports) {
                    return exports.prototype.showLogo = function () {};
                });
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                Cookies.remove('player_forcedType', { domain: '.iqiyi.com' });
                if (Cookies.get('P00001') === 'faked_passport') Cookies.remove('P00001', { domain: '.iqiyi.com' });
                Logger.log('removed cookies.');
            }
        }]);

        return Mocker;
    }();

    var Switcher = function () {
        function Switcher() {
            _classCallCheck(this, Switcher);
        }

        _createClass(Switcher, null, [{
            key: 'switchTo',
            value: function switchTo(toType) {
                Logger.log('switching to ' + toType + ' ...');

                GM_setValue('player_forcedType', toType);
                document.location.reload();
            }
        }]);

        return Switcher;
    }();

    function registerMenu() {
        var MENU_NAME = {
            HTML5: 'HTML5播放器',
            FLASH: 'Flash播放器'
        };

        var currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD); // 默认为Html5播放器，免去切换。

        var _ref2 = currType === PLAYER_TYPE.Html5VOD ? [PLAYER_TYPE.FlashVOD, MENU_NAME.FLASH] : [PLAYER_TYPE.Html5VOD, MENU_NAME.HTML5],
            _ref3 = _slicedToArray(_ref2, 2),
            toType = _ref3[0],
            name = _ref3[1];

        GM_registerMenuCommand(name, function () {
            return Switcher.switchTo(toType);
        }, null);
        Logger.log('registered menu.');
    }

    registerMenu();
    Mocker.mock();
})();
