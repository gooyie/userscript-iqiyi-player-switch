'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==UserScript==
// @name         iqiyi-player-switch
// @namespace    https://github.com/gooyie/userscript-iqiyi-player-switch
// @homepageURL  https://github.com/gooyie/userscript-iqiyi-player-switch
// @supportURL   https://github.com/gooyie/userscript-iqiyi-player-switch/issues
// @updateURL    https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/iqiyi-player-switch.user.js
// @version      1.9.0
// @description  爱奇艺flash播放器与html5播放器随意切换，改善html5播放器播放体验。
// @author       gooyie
// @license      MIT License
//
// @include      *://*.iqiyi.com/*
// @include      *://v.baidu.com/*
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

(function () {
    'use strict';

    var PLAYER_TYPE = {
        Html5VOD: 'h5_VOD',
        FlashVOD: 'flash_VOD'
    };
    /* eslint-disable no-console */

    var Logger = function () {
        function Logger() {
            _classCallCheck(this, Logger);
        }

        _createClass(Logger, null, [{
            key: 'log',
            value: function log() {
                var _console;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                (_console = console).log.apply(_console, ['%c' + this.tag + '%c' + args.shift(), 'color: green; font-weight: bolder', 'color: blue'].concat(args));
            }
        }, {
            key: 'info',
            value: function info() {
                var _console2;

                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                (_console2 = console).info.apply(_console2, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'debug',
            value: function debug() {
                var _console3;

                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                }

                (_console3 = console).debug.apply(_console3, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'warn',
            value: function warn() {
                var _console4;

                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = arguments[_key4];
                }

                (_console4 = console).warn.apply(_console4, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'error',
            value: function error() {
                var _console5;

                for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                    args[_key5] = arguments[_key5];
                }

                (_console5 = console).error.apply(_console5, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'tag',
            get: function get() {
                return '[' + GM_info.script.name + ']';
            }
        }]);

        return Logger;
    }();
    /* eslint-enable no-console */


    var Cookies = function () {
        function Cookies() {
            _classCallCheck(this, Cookies);
        }

        _createClass(Cookies, null, [{
            key: 'get',
            value: function get(key) {
                var value = void 0;
                if (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+$').test(key)) {
                    // eslint-disable-line no-control-regex
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
        }, {
            key: 'isInnerFrame',
            value: function isInnerFrame() {
                return window.top !== window.self;
            }
        }, {
            key: 'isOutsite',
            value: function isOutsite() {
                return !/\.iqiyi\.com$/.test(location.host);
            }
        }, {
            key: 'isFullScreen',
            value: function isFullScreen() {
                return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
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
                    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                        args[_key6] = arguments[_key6];
                    }

                    var ret = call.apply(this, args);
                    try {
                        if (args) cb.apply(undefined, args);
                    } catch (err) {
                        Logger.error(err.stack);
                    }
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
                return args.length === 4 && args[1] instanceof Object && args[1].hasOwnProperty('exports');
            }
        }, {
            key: 'hookFactoryCall',
            value: function hookFactoryCall() {
                var _this = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookCall(function () {
                    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                        args[_key7] = arguments[_key7];
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
                    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                        args[_key8] = arguments[_key8];
                    }

                    if (_this2._isJqueryFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }, {
            key: 'hookJqueryAjax',
            value: function hookJqueryAjax() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookJquery(function (exports) {
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
                    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                        args[_key9] = arguments[_key9];
                    }

                    if (_this3._isHttpFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }, {
            key: 'hookHttpJsonp',
            value: function hookHttpJsonp() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookHttp(function (exports) {
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
                    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                        args[_key10] = arguments[_key10];
                    }

                    if (_this4._isLogoFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }, {
            key: '_isFullScreenFactoryCall',
            value: function _isFullScreenFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return exports.__proto__ && exports.__proto__.hasOwnProperty('isFullScreen');
            }
        }, {
            key: 'hookFullScreen',
            value: function hookFullScreen() {
                var _this5 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
                        args[_key11] = arguments[_key11];
                    }

                    if (_this5._isFullScreenFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }, {
            key: '_isWebFullScreenFactoryCall',
            value: function _isWebFullScreenFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return exports.__proto__ && exports.__proto__.hasOwnProperty('isWebFullScreen');
            }
        }, {
            key: 'hookWebFullScreen',
            value: function hookWebFullScreen() {
                var _this6 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                        args[_key12] = arguments[_key12];
                    }

                    if (_this6._isWebFullScreenFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }, {
            key: 'hookWebFullScreenInit',
            value: function hookWebFullScreenInit() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookWebFullScreen(function (exports) {
                    var init = exports.__proto__.init;
                    exports.__proto__.init = function (wrapper, btn) {
                        cb(this, wrapper, btn);
                        init.apply(this, [wrapper, btn]);
                    };
                });
            }
        }, {
            key: '_isPluginControlsFactoryCall',
            value: function _isPluginControlsFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return 'function' === typeof exports && exports.prototype.hasOwnProperty('initFullScreen');
            }
        }, {
            key: 'hookPluginControls',
            value: function hookPluginControls() {
                var _this7 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
                        args[_key13] = arguments[_key13];
                    }

                    if (_this7._isPluginControlsFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }, {
            key: 'hookPluginControlsInit',
            value: function hookPluginControlsInit() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookPluginControls(function (exports) {
                    var init = exports.prototype.init;
                    exports.prototype.init = function () {
                        cb(this);
                        init.apply(this);
                    };
                });
            }
        }, {
            key: 'hookInitFullScreen',
            value: function hookInitFullScreen() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookPluginControls(function (exports) {
                    var initFullScreen = exports.prototype.initFullScreen;
                    exports.prototype.initFullScreen = function () {
                        cb(this);
                        initFullScreen.apply(this);
                    };
                });
            }
        }, {
            key: '_isCoreFactoryCall',
            value: function _isCoreFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return 'function' === typeof exports && exports.prototype.hasOwnProperty('getdefaultvds') && exports.prototype.hasOwnProperty('getMovieInfo');
            }
        }, {
            key: 'hookCore',
            value: function hookCore() {
                var _this8 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
                        args[_key14] = arguments[_key14];
                    }

                    if (_this8._isCoreFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }, {
            key: '_isSkinBaseFactoryCall',
            value: function _isSkinBaseFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return 'function' === typeof exports && exports.prototype.hasOwnProperty('_checkPlugin');
            }
        }, {
            key: 'hookSkinBase',
            value: function hookSkinBase() {
                var _this9 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
                        args[_key15] = arguments[_key15];
                    }

                    if (_this9._isSkinBaseFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }, {
            key: '_isPluginHotKeysFactoryCall',
            value: function _isPluginHotKeysFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return 'function' === typeof exports && exports.prototype.hasOwnProperty('_keydown');
            }
        }, {
            key: 'hookPluginHotKeys',
            value: function hookPluginHotKeys() {
                var _this10 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
                        args[_key16] = arguments[_key16];
                    }

                    if (_this10._isPluginHotKeysFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }, {
            key: '_isFragmentFactoryCall',
            value: function _isFragmentFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return 'function' === typeof exports && exports.prototype.hasOwnProperty('parseData');
            }
        }, {
            key: 'hookFragment',
            value: function hookFragment() {
                var _this11 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len17 = arguments.length, args = Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
                        args[_key17] = arguments[_key17];
                    }

                    if (_this11._isFragmentFactoryCall(args[1].exports)) cb(args[1].exports);
                });
            }
        }, {
            key: 'hookParseData',
            value: function hookParseData() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFragment(function (exports) {
                    var parseData = exports.prototype.parseData;
                    exports.prototype.parseData = function () {
                        for (var _len18 = arguments.length, args = Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
                            args[_key18] = arguments[_key18];
                        }

                        parseData.apply(this, args);
                        cb(this);
                    };
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
                this.mockForBestDefintion();
                this.mockAd();
                this.mockVip();
                this.mockLogo();
                this.mockCheckPlugin();
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
                var _this12 = this;

                // apply shims
                if (Detector.isFirefox()) {
                    var fetch = unsafeWindow.fetch.bind(unsafeWindow);

                    unsafeWindow.fetch = function (url, opts) {
                        if (_this12._isVideoReq(url)) {
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
                var _this13 = this;

                Hooker.hookJqueryAjax(function (url, options) {
                    if (_this13._isAdReq(url)) {
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
                var _this14 = this;

                if (!this._isLogin()) Faker.fakePassportCookie();

                Hooker.hookHttpJsonp(function (options) {
                    var url = options.url;

                    if (_this14._isCheckVipReq(url)) {
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
            key: 'mockCheckPlugin',
            value: function mockCheckPlugin() {
                Hooker.hookSkinBase(function (exports) {
                    exports.prototype._checkPlugin = function () {};
                });
            }
        }]);

        return Mocker;
    }();

    var Patcher = function () {
        function Patcher() {
            _classCallCheck(this, Patcher);
        }

        _createClass(Patcher, null, [{
            key: '_patchWebFullScreen',
            value: function _patchWebFullScreen() {
                Hooker.hookWebFullScreenInit(function (that, wrapper, btn) {
                    btn.on('toggle', that.toggle.bind(that));
                });
            }
        }, {
            key: '_patchInitFullScreen',
            value: function _patchInitFullScreen() {
                this._patchWebFullScreen();

                Hooker.hookInitFullScreen(function (that) {
                    that.core.on('togglefullscreen', function () {
                        that._fullscreenBtn.fire('click', { data: null });
                    });

                    that.core.on('togglewebfullscreen', function () {
                        that._webfullscreenBtn.fire('toggle', { data: null });
                    });
                });
            }
        }, {
            key: '_patchPluginControls',
            value: function _patchPluginControls() {
                Hooker.hookPluginControlsInit(function (that) {
                    that.core.on('showtip', function (event) {
                        that.setcontroltip.apply(that, [{ str: event.data, x: that._process.offset().left, y: 3, cut: true, timeout: true }]);
                        if (that.$plugin.hasClass('process_hidden')) {
                            that._controltips.css('top', '-25px');
                        } else if (that.$plugin.hasClass('bottom-hide')) {
                            that._controltips.css('top', '-38px');
                        }
                    });
                });
            }
        }, {
            key: '_obtainFlvInfo',
            value: function _obtainFlvInfo() {
                var _this15 = this;

                Hooker.hookParseData(function (that) {
                    return _this15._flvInfo = that.flvInfo;
                });
            }
        }, {
            key: '_patchCore',
            value: function _patchCore() {
                var self = this;

                this._patchPluginControls();
                this._patchInitFullScreen();
                this._obtainFlvInfo();

                Hooker.hookCore(function (exports) {
                    exports.prototype._showTip = function (msg) {
                        this.fire({ type: 'showtip', data: msg });
                    };

                    exports.prototype.getFPS = function () {
                        if (self._flvInfo) {
                            return self._flvInfo.videoConfigTag.sps.frame_rate.fps;
                        } else {
                            return 25; // f4v极速以上，动画23.976、电影24、电视剧25。
                        }
                    };

                    exports.prototype.previousFrame = function () {
                        var video = this.video();
                        var seekTime = Math.max(0, Math.min(this.getDuration(), video.currentTime - 1 / this.getFPS()));
                        video.currentTime = seekTime;
                        this._showTip('上一帧');
                    };

                    exports.prototype.nextFrame = function () {
                        var video = this.video();
                        var seekTime = Math.max(0, Math.min(this.getDuration(), video.currentTime + 1 / this.getFPS()));
                        video.currentTime = seekTime;
                        this._showTip('下一帧');
                    };

                    exports.prototype.stepSeek = function (stepTime) {
                        var seekTime = Math.max(0, Math.min(this.getDuration(), this.getCurrenttime() + stepTime));
                        var msg = void 0;

                        if (Math.abs(stepTime) < 60) {
                            msg = stepTime > 0 ? '\u6B65\u8FDB\uFF1A' + stepTime + '\u79D2' : '\u6B65\u9000\uFF1A' + Math.abs(stepTime) + '\u79D2';
                        } else {
                            msg = stepTime > 0 ? '\u6B65\u8FDB\uFF1A' + stepTime / 60 + '\u5206\u949F' : '\u6B65\u9000\uFF1A' + Math.abs(stepTime) / 60 + '\u5206\u949F';
                        }
                        this._showTip(msg);

                        this.seek(seekTime, true);
                    };

                    exports.prototype.rangeSeek = function (range) {
                        var duration = this.getDuration();
                        var seekTime = Math.max(0, Math.min(duration, duration * range));
                        this.seek(seekTime, true);
                        this._showTip('定位：' + (range * 100).toFixed(0) + '%');
                    };

                    exports.prototype.toggleMute = function () {
                        if (this.getMuted()) {
                            this.setMuted(false);
                            this._showTip('取消静音');
                        } else {
                            this.setMuted(true);
                            this._showTip('静音');
                        }
                    };

                    exports.prototype.adjustVolume = function (value) {
                        var volume = this.getVolume() + value;
                        volume = Math.max(0, Math.min(1, volume.toFixed(2)));
                        this.setVolume(volume);
                        this.fire({ type: 'keyvolumechange' });
                    };

                    exports.prototype.adjustPlaybackRate = function (value) {
                        var video = this.video();
                        var playbackRate = Math.max(0.2, Math.min(5, video.playbackRate + value));
                        video.playbackRate = playbackRate;
                        this._showTip('\u64AD\u653E\u901F\u7387\uFF1A' + playbackRate.toFixed(1).replace(/\.0+$/, ''));
                    };

                    exports.prototype.resetPlaybackRate = function () {
                        var video = this.video();
                        video.playbackRate = 1;
                        this._showTip('恢复播放速率');
                    };

                    exports.prototype.hasPreVideo = function () {
                        return this._getVideoIndexInList(this._movieinfo.tvid) > 0 || this._getVideoIndexInList(this._movieinfo.oldTvid) > 0;
                    };

                    exports.prototype.playNext = function () {
                        if (this.hasNextVideo()) {
                            this._showTip('播放下一集');
                            this.switchNextVideo();
                        } else {
                            this._showTip('没有下一集哦');
                        }
                    };

                    exports.prototype.playPre = function () {
                        if (this.hasPreVideo()) {
                            this._showTip('播放上一集');
                            this.switchPreVideo();
                        } else {
                            this._showTip('没有上一集哦');
                        }
                    };
                });
            }
        }, {
            key: '_patchKeyShortcuts',
            value: function _patchKeyShortcuts() {
                Hooker.hookPluginHotKeys(function (exports) {
                    exports.prototype.init = function () {
                        document.addEventListener('keydown', this._keydown.bind(this));
                    };

                    exports.prototype._isValidTarget = function (target) {
                        return target.nodeName === 'BODY' || target.nodeName == 'VIDEO' || target.classList.contains('pw-video'); // 全局
                        // return target.nodeName === 'VIDEO' || target.classList.contains('pw-video'); // 非全局
                    };

                    exports.prototype._keydown = function (event) {
                        if (!this._isValidTarget(event.target)) return;

                        switch (event.keyCode) {
                            case 32:
                                // Spacebar
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
                            case 39: // → Arrow Right
                            case 37:
                                {
                                    // ← Arrow Left
                                    var stepTime = void 0;
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
                            case 40:
                                // ↓ Arrow Down
                                if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                                    this.core.adjustVolume(38 === event.keyCode ? 0.05 : -0.05);
                                } else {
                                    return;
                                }
                                break;
                            case 77:
                                // M
                                if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                                    this.core.toggleMute();
                                } else {
                                    return;
                                }
                                break;
                            case 13:
                                // Enter
                                if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                                    this.core.fire({ type: 'togglefullscreen' });
                                } else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
                                    this.core.fire({ type: 'togglewebfullscreen' });
                                } else {
                                    return;
                                }
                                break;
                            case 67: // C
                            case 88:
                                // X
                                if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                                    this.core.adjustPlaybackRate(67 === event.keyCode ? 0.1 : -0.1);
                                } else {
                                    return;
                                }
                                break;
                            case 90:
                                // Z
                                if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                                    this.core.resetPlaybackRate();
                                } else {
                                    return;
                                }
                                break;
                            case 68: // D
                            case 70:
                                // F
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
                            case 78:
                                // N
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
                                if (event.keyCode >= 48 && event.keyCode <= 57) {
                                    // 0 ~ 9
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
        }, {
            key: '_patchMouseShortcuts',
            value: function _patchMouseShortcuts() {
                Hooker.hookPluginControlsInit(function (that) {
                    document.addEventListener('wheel', function (event) {
                        if (!Detector.isFullScreen()) return;

                        var delta = event.wheelDelta || event.detail || event.deltaY && -event.deltaY;
                        that.core.adjustVolume(delta > 0 ? 0.05 : -0.05);
                    });

                    Logger.log('添加鼠标快捷键');
                });
            }
        }, {
            key: 'patchShortcuts',
            value: function patchShortcuts() {
                this._patchCore();

                this._patchKeyShortcuts();
                this._patchMouseShortcuts();
            }
        }]);

        return Patcher;
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

    var Finder = function () {
        function Finder() {
            _classCallCheck(this, Finder);
        }

        _createClass(Finder, null, [{
            key: 'findVid',
            value: function findVid(text) {
                var result = /vid=([\da-z]+)/.exec(text);
                return result ? result[1] : null;
            }
        }, {
            key: 'findTvid',
            value: function findTvid(text) {
                var result = /tvId=(\d+)/.exec(text);
                return result ? result[1] : null;
            }
        }, {
            key: 'findEmbedNodes',
            value: function findEmbedNodes() {
                var nodes = document.querySelectorAll('object, embed');
                return nodes.length > 0 ? nodes : null;
            }
        }]);

        return Finder;
    }();

    function getVideoUrl(tvid, vid) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                url: 'http://cache.video.qiyi.com/jp/vi/' + tvid + '/' + vid + '/?callback=callback',
                method: 'GET',
                timeout: 8e3,
                onload: function onload(details) {
                    try {
                        var json = JSON.parse(/callback\s*\(\s*(\{.*\})\s*\)/.exec(details.responseText)[1]);
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

    function embedSrc(targetNode, _ref2) {
        var tvid = _ref2.tvid,
            vid = _ref2.vid;

        targetNode.innerHTML = '<div class="' + GM_info.script.name + ' info">\u6B63\u5728\u83B7\u53D6\u89C6\u9891\u6E90...</div>';

        getVideoUrl(tvid, vid).then(function (url) {
            targetNode.innerHTML = '<iframe id="innerFrame" src="' + url + '" frameborder="0" allowfullscreen="true" width="100%" height="100%"></iframe>';
        }).catch(function (err) {
            targetNode.innerHTML = '<div class="' + GM_info.script.name + ' error"><p>\u83B7\u53D6\u89C6\u9891\u6E90\u51FA\u9519\uFF01</p><p>' + err.message + '</p></div>';
        });
    }

    function replaceFlash() {
        var observer = new MutationObserver(function (records, self) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = records[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var record = _step.value;

                    if (record.type !== 'childList' || !record.addedNodes) continue;

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = record.addedNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var node = _step2.value;

                            if (node.nodeName !== 'OBJECT' && node.nodeName !== 'EMBED') continue;

                            var text = node.outerHTML;
                            var vid = Finder.findVid(text);
                            var tvid = Finder.findTvid(text);

                            if (tvid && vid) {
                                Logger.log('finded player', node);
                                embedSrc(node.parentNode, { tvid: tvid, vid: vid });
                                self.disconnect();
                                Logger.log('stoped observation');
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        });

        observer.observe(document.body || document.documentElement, { subtree: true, childList: true });
        Logger.log('started observation');
    }

    function adapteIframe() {
        var style = '\n            body[class|="qypage"] {\n                overflow: hidden !important;\n                background: #000 !important;\n                visibility: hidden;\n            }\n\n            .mod-func {\n                display: none !important;\n            }\n\n            .' + GM_info.script.name + '.info {\n                width: 20em;\n                height: 5em;\n                position: absolute;\n                top: 0;\n                bottom: 0;\n                left: 0;\n                right: 0;\n                margin: auto;\n                text-align: center;\n                line-height: 5em;\n                font-size: 1em;\n                color: #ccc;\n            }\n\n            .' + GM_info.script.name + '.error {\n                height: 3em;\n                position: absolute;\n                top: 0;\n                bottom: 0;\n                left: 0;\n                right: 0;\n                margin: auto;\n                text-align: center;\n                font-size: 1em;\n                color: #c00;\n            }\n        ';

        GM_addStyle(style);

        Hooker.hookWebFullScreen(function (exports) {
            var init = exports.__proto__.init;
            exports.__proto__.init = function (wrapper, btn) {
                init.apply(this, [wrapper, btn]);
                this.enter();

                btn[0].style.display = 'none';
                document.body.style.visibility = 'visible';
            };

            exports.__proto__.exit = function () {};
        });

        Hooker.hookCore(function (exports) {
            exports.prototype.hasNextVideo = function () {
                return null;
            };
        });
    }

    function forceHtml5() {
        Logger.log('setting player_forcedType cookie as ' + PLAYER_TYPE.Html5VOD);
        Cookies.set('player_forcedType', PLAYER_TYPE.Html5VOD, { domain: '.iqiyi.com' });
    }

    function forceFlash() {
        Logger.log('setting player_forcedType cookie as ' + PLAYER_TYPE.FlashVOD);
        Cookies.set('player_forcedType', PLAYER_TYPE.FlashVOD, { domain: '.iqiyi.com' });
    }

    function clean() {
        Cookies.remove('player_forcedType', { domain: '.iqiyi.com' });
        if (Cookies.get('P00001') === 'faked_passport') Cookies.remove('P00001', { domain: '.iqiyi.com' });
        Logger.log('removed cookies.');
    }

    function registerMenu() {
        var MENU_NAME = {
            HTML5: 'HTML5播放器',
            FLASH: 'Flash播放器'
        };

        var currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD); // 默认为Html5播放器，免去切换。

        var _ref3 = currType === PLAYER_TYPE.Html5VOD ? [PLAYER_TYPE.FlashVOD, MENU_NAME.FLASH] : [PLAYER_TYPE.Html5VOD, MENU_NAME.HTML5],
            _ref4 = _slicedToArray(_ref3, 2),
            toType = _ref4[0],
            name = _ref4[1];

        GM_registerMenuCommand(name, function () {
            return Switcher.switchTo(toType);
        }, null);
        Logger.log('registered menu.');
    }

    //=============================================================================

    registerMenu();

    var currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD);
    if (currType === PLAYER_TYPE.Html5VOD) {
        if (!Detector.isSupportHtml5()) {
            alert('╮(╯▽╰)╭ 你的浏览器播放不了html5视频~~~~');
            return;
        }

        forceHtml5();
        Mocker.mock();
        Patcher.patchShortcuts();

        if (Detector.isInnerFrame()) adapteIframe();
        if (Detector.isOutsite()) replaceFlash();
    } else {
        forceFlash();
    }

    window.addEventListener('unload', function () {
        return clean();
    });
})();
