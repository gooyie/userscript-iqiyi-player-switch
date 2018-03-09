
// ==UserScript==
// @name         iqiyi-player-switch
// @namespace    https://github.com/gooyie/userscript-iqiyi-player-switch
// @homepageURL  https://github.com/gooyie/userscript-iqiyi-player-switch
// @supportURL   https://github.com/gooyie/userscript-iqiyi-player-switch/issues
// @updateURL    https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/dist/iqiyi-player-switch.user.js
// @description  爱奇艺flash播放器与html5播放器随意切换，改善html5播放器播放体验。
// @version      1.13.0
// @compatible   chrome >= 43
// @compatible   firefox >= 45
// @compatible   edge >= 15
// @author       gooyie
// @license      MIT License
//
// @include      *://*.iqiyi.com/*
// @include      *://v.baidu.com/*
// @include      *://music.baidu.com/mv/*
// @include      *://www.zybus.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        unsafeWindow
// @connect      qiyi.com
// @run-at       document-start
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hooker = function () {
    function Hooker() {
        _classCallCheck(this, Hooker);
    }

    _createClass(Hooker, null, [{
        key: '_hookCall',
        value: function _hookCall(cb) {
            var call = Function.prototype.call;
            Function.prototype.call = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var ret = call.apply(this, args);
                try {
                    if (args && cb(args)) {
                        Function.prototype.call = call;
                        cb = function cb() {};
                        _logger2.default.info('restored call');
                    }
                } catch (err) {
                    _logger2.default.error(err.stack);
                }
                return ret;
            };
            this._hookCall = null;
        }
    }, {
        key: '_isModuleCall',
        value: function _isModuleCall(args) {
            // module.exports, module, module.exports, require
            return args.length === 4 && args[1] && Object.getPrototypeOf(args[1]) === Object.prototype && args[1].hasOwnProperty('exports');
        }
    }, {
        key: '_hookModuleCall',
        value: function _hookModuleCall(cb, pred) {
            var _this = this;

            var callbacksMap = new Map([[pred, [cb]]]);
            this._hookCall(function (args) {
                if (!_this._isModuleCall(args)) return;

                var exports = args[1].exports;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = callbacksMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _ref = _step.value;

                        var _ref2 = _slicedToArray(_ref, 2);

                        var _pred = _ref2[0];
                        var callbacks = _ref2[1];

                        if (!_pred.apply(_this, [exports])) continue;
                        callbacks.forEach(function (cb) {
                            return cb(exports, args);
                        });
                        _this.keepalive || callbacksMap.delete(_pred);
                        !callbacksMap.size && (_this._hookModuleCall = null);
                        break;
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

                return !callbacksMap.size;
            });

            this._hookModuleCall = function (cb, pred) {
                if (callbacksMap.has(pred)) {
                    callbacksMap.get(pred).push(cb);
                } else {
                    callbacksMap.set(pred, [cb]);
                }
            };
        }
    }, {
        key: '_isJqueryModuleCall',
        value: function _isJqueryModuleCall(exports) {
            return exports.hasOwnProperty('fn') && exports.fn.hasOwnProperty('jquery');
        }
    }, {
        key: 'hookJquery',
        value: function hookJquery() {
            var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

            this._hookModuleCall(cb, this._isJqueryModuleCall);
        }
    }, {
        key: 'hookJqueryAjax',
        value: function hookJqueryAjax(cb) {
            this.hookJquery(function (exports) {
                var ajax = exports.ajax.bind(exports);
                exports.ajax = function (url) {
                    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                    if (typeof url === 'object') {
                        var _ref3 = [url.url, url];
                        url = _ref3[0];
                        options = _ref3[1];
                    }
                    var isHijacked = cb(url, options);
                    if (isHijacked) return;
                    return ajax(url, options);
                };
            });
        }
    }, {
        key: '_isHttpModuleCall',
        value: function _isHttpModuleCall(exports) {
            return exports.hasOwnProperty('jsonp') && exports.hasOwnProperty('ajax');
        }
    }, {
        key: 'hookHttp',
        value: function hookHttp(cb) {
            this._hookModuleCall(cb, this._isHttpModuleCall);
        }
    }, {
        key: 'hookHttpJsonp',
        value: function hookHttpJsonp(cb) {
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
        key: '_isLogoModuleCall',
        value: function _isLogoModuleCall(exports) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('showLogo');
        }
    }, {
        key: 'hookLogo',
        value: function hookLogo(cb) {
            this._hookModuleCall(cb, this._isLogoModuleCall);
        }
    }, {
        key: '_isFullScreenModuleCall',
        value: function _isFullScreenModuleCall(exports) {
            return exports.__proto__ && exports.__proto__.hasOwnProperty('isFullScreen');
        }
    }, {
        key: 'hookFullScreen',
        value: function hookFullScreen(cb) {
            this._hookModuleCall(cb, this._isFullScreenModuleCall);
        }
    }, {
        key: '_isWebFullScreenModuleCall',
        value: function _isWebFullScreenModuleCall(exports) {
            return exports.__proto__ && exports.__proto__.hasOwnProperty('isWebFullScreen');
        }
    }, {
        key: 'hookWebFullScreen',
        value: function hookWebFullScreen(cb) {
            this._hookModuleCall(cb, this._isWebFullScreenModuleCall);
        }
    }, {
        key: 'hookWebFullScreenInit',
        value: function hookWebFullScreenInit(cb) {
            this.hookWebFullScreen(function (exports) {
                var init = exports.__proto__.init;
                exports.__proto__.init = function (wrapper, btn) {
                    cb(this, wrapper, btn);
                    init.apply(this, [wrapper, btn]);
                };
            });
        }
    }, {
        key: '_isPluginControlsModuleCall',
        value: function _isPluginControlsModuleCall(exports) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('initFullScreen');
        }
    }, {
        key: 'hookPluginControls',
        value: function hookPluginControls(cb) {
            this._hookModuleCall(cb, this._isPluginControlsModuleCall);
        }
    }, {
        key: 'hookPluginControlsInit',
        value: function hookPluginControlsInit(cb) {
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
        value: function hookInitFullScreen(cb) {
            this.hookPluginControls(function (exports) {
                var initFullScreen = exports.prototype.initFullScreen;
                exports.prototype.initFullScreen = function () {
                    cb(this);
                    initFullScreen.apply(this);
                };
            });
        }
    }, {
        key: '_isCoreModuleCall',
        value: function _isCoreModuleCall(exports) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('getdefaultvds') && exports.prototype.hasOwnProperty('getMovieInfo');
        }
    }, {
        key: 'hookCore',
        value: function hookCore(cb) {
            this._hookModuleCall(cb, this._isCoreModuleCall);
        }
    }, {
        key: '_isSkinBaseModuleCall',
        value: function _isSkinBaseModuleCall(exports) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('_checkPlugin');
        }
    }, {
        key: 'hookSkinBase',
        value: function hookSkinBase(cb) {
            this._hookModuleCall(cb, this._isSkinBaseModuleCall);
        }
    }, {
        key: '_isPluginHotKeysModuleCall',
        value: function _isPluginHotKeysModuleCall(exports) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('_keydown');
        }
    }, {
        key: 'hookPluginHotKeys',
        value: function hookPluginHotKeys(cb) {
            this._hookModuleCall(cb, this._isPluginHotKeysModuleCall);
        }
    }, {
        key: '_isFragmentModuleCall',
        value: function _isFragmentModuleCall(exports) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('parseData');
        }
    }, {
        key: 'hookFragment',
        value: function hookFragment(cb) {
            this._hookModuleCall(cb, this._isFragmentModuleCall);
        }
    }, {
        key: 'hookParseData',
        value: function hookParseData(cb) {
            this.hookFragment(function (exports) {
                var parseData = exports.prototype.parseData;
                exports.prototype.parseData = function () {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    parseData.apply(this, args);
                    cb(this);
                };
            });
        }
    }, {
        key: '_isUserModuleCall',
        value: function _isUserModuleCall(exports) {
            return exports.__proto__ && exports.__proto__.hasOwnProperty('isVip');
        }
    }, {
        key: 'hookUser',
        value: function hookUser(cb) {
            this._hookModuleCall(cb, this._isUserModuleCall);
        }
    }, {
        key: '_isShowRequestModuleCall',
        value: function _isShowRequestModuleCall(exports) {
            return 'function' === typeof exports && exports.compressRequestKey && exports.prototype.hasOwnProperty('request');
        }
    }, {
        key: 'hookShowRequest',
        value: function hookShowRequest(cb) {
            this._hookModuleCall(cb, this._isShowRequestModuleCall);
        }
    }, {
        key: '_isDefaultSkinModuleCall',
        value: function _isDefaultSkinModuleCall(exports) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('_initDBClicks');
        }
    }, {
        key: 'hookDefaultSkin',
        value: function hookDefaultSkin(cb) {
            this._hookModuleCall(cb, this._isDefaultSkinModuleCall);
        }
    }, {
        key: '_isConfigModuleCall',
        value: function _isConfigModuleCall(exports) {
            return exports.loadType && exports.dispatchCfg;
        }
    }, {
        key: 'hookConfig',
        value: function hookConfig(cb) {
            this._hookModuleCall(cb, this._isConfigModuleCall);
        }
    }]);

    return Hooker;
}();

Hooker.keepalive = false;

exports.default = Hooker;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-console */
var Logger = function () {
    function Logger(tag) {
        _classCallCheck(this, Logger);

        this._tag = tag;
    }

    _createClass(Logger, [{
        key: 'log',
        value: function log() {
            var _console;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            (_console = console).log.apply(_console, [this.tag + args.shift()].concat(args));
        }
    }, {
        key: 'info',
        value: function info() {
            var _console2;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            (_console2 = console).log.apply(_console2, ['%c' + this.tag + '%c' + args.shift(), 'color: green; font-weight: bolder', 'color: blue'].concat(args));
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
            return this._tag;
        }
    }]);

    return Logger;
}();

exports.default = new Logger(`[${GM_info.script.name}]`);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        key: 'isInIFrame',
        value: function isInIFrame() {
            return window.top !== window.self;
        }
    }, {
        key: 'isOutsite',
        value: function isOutsite() {
            return !/\.iqiyi\.com$/.test(location.host);
        }
    }, {
        key: 'isOutsideLink',
        value: function isOutsideLink() {
            return location.hash === '#outsidelink';
        }
    }, {
        key: 'hasFlashPlugin',
        value: function hasFlashPlugin() {
            var plugins = unsafeWindow.navigator.plugins;
            return !!(plugins['Shockwave Flash'] && plugins['Shockwave Flash'].description);
        }
    }]);

    return Detector;
}();

exports.default = Detector;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            var ver = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            var UA_CHROME = `Chrome/${ver}`;
            Object.defineProperty(unsafeWindow.navigator, 'userAgent', { get: function get() {
                    return UA_CHROME;
                } });
        }
    }, {
        key: 'fakeFlashPlugin',
        value: function fakeFlashPlugin() {
            var plugin = {
                description: 'Shockwave Flash 26.0 r0',
                filename: 'pepflashplayer64_26_0_0_131.dll',
                length: 0,
                name: 'Shockwave Flash'
            };

            Reflect.setPrototypeOf(plugin, Plugin.prototype);
            unsafeWindow.navigator.plugins['Shockwave Flash'] = plugin;
        }
    }]);

    return Faker;
}();

exports.default = Faker;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _cookies = __webpack_require__(6);

var _cookies2 = _interopRequireDefault(_cookies);

var _detector = __webpack_require__(2);

var _detector2 = _interopRequireDefault(_detector);

var _hooker = __webpack_require__(0);

var _hooker2 = _interopRequireDefault(_hooker);

var _faker = __webpack_require__(3);

var _faker2 = _interopRequireDefault(_faker);

var _outsite = __webpack_require__(7);

var _patch = __webpack_require__(12);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLAYER_TYPE = {
    Html5VOD: 'h5_VOD',
    FlashVOD: 'flash_VOD'
};

function forceHtml5() {
    _logger2.default.info(`setting player_forcedType cookie as ${PLAYER_TYPE.Html5VOD}`);
    _cookies2.default.set('player_forcedType', PLAYER_TYPE.Html5VOD, { domain: '.iqiyi.com' });
}

function forceFlash() {
    _logger2.default.info(`setting player_forcedType cookie as ${PLAYER_TYPE.FlashVOD}`);
    _cookies2.default.set('player_forcedType', PLAYER_TYPE.FlashVOD, { domain: '.iqiyi.com' });
}

function clean() {
    _cookies2.default.remove('player_forcedType', { domain: '.iqiyi.com' });
    _logger2.default.info(`removed cookies.`);
}

function switchTo(toType) {
    _logger2.default.info(`switching to ${toType} ...`);

    GM_setValue('player_forcedType', toType);
    document.location.reload();
}

function registerMenu() {
    var MENU_NAME = {
        HTML5: 'HTML5播放器',
        FLASH: 'Flash播放器'
    };

    var currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD); // 默认为Html5播放器，免去切换。

    var _ref = currType === PLAYER_TYPE.Html5VOD ? [PLAYER_TYPE.FlashVOD, MENU_NAME.FLASH] : [PLAYER_TYPE.Html5VOD, MENU_NAME.HTML5],
        _ref2 = _slicedToArray(_ref, 2),
        toType = _ref2[0],
        name = _ref2[1];

    GM_registerMenuCommand(name, function () {
        return switchTo(toType);
    }, null);
    _logger2.default.info(`registered menu.`);
}

//=============================================================================

registerMenu();

var currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD);
if (currType === PLAYER_TYPE.Html5VOD) {
    if (_detector2.default.isSupportHtml5()) {
        if (_detector2.default.isOutsite()) {
            (0, _outsite.replaceFlash)();
        } else {
            if (location.search.includes('list')) {
                _hooker2.default.keepalive = true;
                _logger2.default.info('keepalive hooks');
            }

            forceHtml5();

            if (_detector2.default.isFirefox()) {
                // Fake Chrome with version 42 to use the data engine to play videos higher than HD
                // and to use the XHR loader because Firefox has not implemented ReadableStream
                // to support the Fetch loader yet.
                _faker2.default.fakeChrome(42);
            }

            _patch.adsPatch.install();
            _patch.watermarksPatch.install();
            _patch.vipPatch.install();
            _patch.checkPluginPatch.install();
            _patch.keyShortcutsPatch.install();
            _patch.mouseShortcutsPatch.install();
            _patch.useWebSocketLoaderPatch.install();

            if (_detector2.default.isInIFrame() && _detector2.default.isOutsideLink()) {
                (0, _outsite.adaptIframe)();
            }
        }
    } else {
        alert('╮(╯▽╰)╭ 你的浏览器播放不了html5视频~~~~');
    }
} else {
    forceFlash();
}

window.addEventListener('unload', function () {
    return clean();
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            document.cookie = `${key}=${value}${path}${expires}${domain}`;
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

exports.default = Cookies;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.adaptIframe = exports.replaceFlash = undefined;

var _regenerator = __webpack_require__(8);

var _regenerator2 = _interopRequireDefault(_regenerator);

var embedSrc = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(targetNode, _ref) {
        var tvid = _ref.tvid,
            vid = _ref.vid;
        var url;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        targetNode.innerHTML = `<div class="${GM_info.script.name} info">正在获取视频源...</div>`;

                        _context.prev = 1;
                        _context.next = 4;
                        return (0, _utils.getVideoUrl)(tvid, vid);

                    case 4:
                        url = _context.sent;

                        _logger2.default.info('source url: %s', url);
                        targetNode.innerHTML = `<iframe id="outsidelink" src="${url}#outsidelink" frameborder="0" allowfullscreen="true" width="100%" height="100%"></iframe>`;
                        _context.next = 12;
                        break;

                    case 9:
                        _context.prev = 9;
                        _context.t0 = _context['catch'](1);

                        targetNode.innerHTML = `<div class="${GM_info.script.name} error"><p>获取视频源出错！</p><p>${_context.t0.message}</p></div>`;

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[1, 9]]);
    }));

    return function embedSrc(_x, _x2) {
        return _ref2.apply(this, arguments);
    };
}();

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _hooker = __webpack_require__(0);

var _hooker2 = _interopRequireDefault(_hooker);

var _faker = __webpack_require__(3);

var _faker2 = _interopRequireDefault(_faker);

var _detector = __webpack_require__(2);

var _detector2 = _interopRequireDefault(_detector);

var _utils = __webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function replaceFlash() {
    if (!_detector2.default.hasFlashPlugin()) _faker2.default.fakeFlashPlugin();

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
                        _logger2.default.info('found node', node);

                        var text = node.outerHTML;
                        var vid = (0, _utils.findVid)(text);
                        var tvid = (0, _utils.findTvid)(text);

                        if (tvid && vid) {
                            _logger2.default.info('found tvid: %s, vid: %s', tvid, vid);
                            embedSrc(node.parentNode, { tvid, vid });
                            self.disconnect();
                            _logger2.default.info('stoped observation');
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
    _logger2.default.info('started observation');
}

function adaptIframe() {
    var style = `
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

    _hooker2.default.hookWebFullScreen(function (exports) {
        var init = exports.__proto__.init;
        exports.__proto__.init = function (wrapper, btn) {
            init.apply(this, [wrapper, btn]);
            this.enter();

            btn[0].style.display = 'none';
            document.body.style.visibility = 'visible';
        };

        exports.__proto__.exit = function () {};
    });

    _hooker2.default.hookCore(function (exports) {
        exports.prototype.hasNextVideo = function () {
            return null;
        };
    });
}

exports.replaceFlash = replaceFlash;
exports.adaptIframe = adaptIframe;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(10);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function getVideoUrl(tvid, vid) {
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            url: `http://cache.video.qiyi.com/jp/vi/${tvid}/${vid}/?callback=callback`,
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

function findVid(text) {
    var result = /vid=([\da-z]+)/i.exec(text);
    return result ? result[1] : null;
}

function findTvid(text) {
    var result = /tvid=(\d+)/i.exec(text);
    return result ? result[1] : null;
}

exports.getVideoUrl = getVideoUrl;
exports.findVid = findVid;
exports.findTvid = findTvid;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useWebSocketLoaderPatch = exports.mouseShortcutsPatch = exports.keyShortcutsPatch = exports.checkPluginPatch = exports.watermarksPatch = exports.adsPatch = exports.vipPatch = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _hooker = __webpack_require__(0);

var _hooker2 = _interopRequireDefault(_hooker);

var _fullscreen = __webpack_require__(13);

var _webFullscreen = __webpack_require__(14);

var _parsedData = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Patch = function () {
    function Patch() {
        _classCallCheck(this, Patch);

        this._installed = false;
    }

    _createClass(Patch, [{
        key: 'install',
        value: function install() {
            if (!this._installed) {
                this._installed = true;
                this._prepare();
                this._apply();
            }
        }
    }, {
        key: '_prepare',
        value: function _prepare() {}
    }, {
        key: '_apply',
        value: function _apply() {}
    }]);

    return Patch;
}();

var VipPatch = function (_Patch) {
    _inherits(VipPatch, _Patch);

    function VipPatch() {
        _classCallCheck(this, VipPatch);

        return _possibleConstructorReturn(this, (VipPatch.__proto__ || Object.getPrototypeOf(VipPatch)).call(this));
    }

    _createClass(VipPatch, [{
        key: '_apply',
        value: function _apply() {
            _hooker2.default.hookUser(function (exports) {
                var proto = exports.__proto__;
                proto.isVipSync = function () {
                    return true;
                };
                proto.isVip = function (cb) {
                    return setTimeout(cb, 0, true);
                };
                _logger2.default.info('vip 补丁已安装');
            });
        }
    }]);

    return VipPatch;
}(Patch);

var AdsPatch = function (_Patch2) {
    _inherits(AdsPatch, _Patch2);

    function AdsPatch() {
        _classCallCheck(this, AdsPatch);

        return _possibleConstructorReturn(this, (AdsPatch.__proto__ || Object.getPrototypeOf(AdsPatch)).call(this));
    }

    _createClass(AdsPatch, [{
        key: '_fakeAdsData',
        value: function _fakeAdsData() {
            return {};
        }
    }, {
        key: '_apply',
        value: function _apply() {
            var _this3 = this;

            _hooker2.default.hookShowRequest(function (exports) {
                var proto = exports.prototype;
                proto.request = function (cb) {
                    return setTimeout(cb, 0, _this3._fakeAdsData());
                };
                _logger2.default.info('和谐广告补丁已安装');
            });
        }
    }]);

    return AdsPatch;
}(Patch);

var WatermarksPatch = function (_Patch3) {
    _inherits(WatermarksPatch, _Patch3);

    function WatermarksPatch() {
        _classCallCheck(this, WatermarksPatch);

        return _possibleConstructorReturn(this, (WatermarksPatch.__proto__ || Object.getPrototypeOf(WatermarksPatch)).call(this));
    }

    _createClass(WatermarksPatch, [{
        key: '_apply',
        value: function _apply() {
            _hooker2.default.hookLogo(function (exports) {
                exports.prototype.showLogo = function () {};
                _logger2.default.info('和谐水印补丁已安装');
            });
        }
    }]);

    return WatermarksPatch;
}(Patch);

var CheckPluginPatch = function (_Patch4) {
    _inherits(CheckPluginPatch, _Patch4);

    function CheckPluginPatch() {
        _classCallCheck(this, CheckPluginPatch);

        return _possibleConstructorReturn(this, (CheckPluginPatch.__proto__ || Object.getPrototypeOf(CheckPluginPatch)).call(this));
    }

    _createClass(CheckPluginPatch, [{
        key: '_apply',
        value: function _apply() {
            _hooker2.default.hookSkinBase(function (exports) {
                exports.prototype._checkPlugin = function () {};
                _logger2.default.info('阻止插件检测补丁已安装');
            });
        }
    }]);

    return CheckPluginPatch;
}(Patch);

var CorePatch = function (_Patch5) {
    _inherits(CorePatch, _Patch5);

    function CorePatch() {
        _classCallCheck(this, CorePatch);

        return _possibleConstructorReturn(this, (CorePatch.__proto__ || Object.getPrototypeOf(CorePatch)).call(this));
    }

    _createClass(CorePatch, [{
        key: '_prepare',
        value: function _prepare() {
            this._initShowTip();
            this._initPlaybackRate();
        }
    }, {
        key: '_initShowTip',
        value: function _initShowTip() {
            _hooker2.default.hookPluginControlsInit(function (that) {
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
        key: '_initPlaybackRate',
        value: function _initPlaybackRate() {
            _hooker2.default.hookPluginControls(function (exports) {
                exports.prototype.initPlaybackRate = function () {
                    var core = this.core;

                    var rate = parseFloat(localStorage.getItem('QiyiPlayerPlaybackRate'));
                    rate = isNaN(rate) ? 1 : rate;

                    if (core.getCurrStatus() === 'playing') {
                        core.setPlaybackRate(rate);
                    } else {
                        var onstatuschanged = function onstatuschanged(evt) {
                            if (evt.data.state === 'playing') {
                                core.setPlaybackRate(rate);
                                core.un('statusChanged', onstatuschanged);
                            }
                        };
                        core.on('statusChanged', onstatuschanged);
                    }

                    var $ul = this.$playbackrateUl;
                    $ul.find(`[data-pbrate="${rate}"]`).addClass('selected');

                    var $items = $ul.find('li');
                    $items.on('click', function () {
                        var rate = parseFloat(this.getAttribute('data-pbrate'));
                        if (!this.classList.contains('selected')) {
                            $items.removeClass('selected');
                            this.classList.add('selected');
                        }
                        localStorage.setItem('QiyiPlayerPlaybackRate', rate);
                        core.setPlaybackRate(rate);
                    });

                    this.$playsettingicon.on('click', function () {
                        var rate = core.getPlaybackRate();
                        var $item = $ul.find(`[data-pbrate="${rate}"]`);
                        if ($item.length === 1) {
                            if (!$item.hasClass('selected')) {
                                $items.removeClass('selected');
                                $item.addClass('selected');
                            }
                        } else {
                            $items.removeClass('selected');
                        }
                    });
                };
            });
        }
    }, {
        key: '_apply',
        value: function _apply() {
            _hooker2.default.hookCore(function (exports) {
                var proto = exports.prototype;

                proto._showTip = function (msg) {
                    this.fire({ type: 'showtip', data: msg });
                };

                proto.getFPS = function () {
                    if (_parsedData.flvInfo) {
                        return _parsedData.flvInfo.videoConfigTag.sps.frame_rate.fps;
                    } else {
                        return 25; // f4v极速以上，动画23.976、电影24、电视剧25。
                    }
                };

                proto.prevFrame = function () {
                    var video = this.video();
                    var seekTime = Math.max(0, Math.min(this.getDuration(), video.currentTime - 1 / this.getFPS()));
                    video.currentTime = seekTime;
                    this._showTip('上一帧');
                };

                proto.nextFrame = function () {
                    var video = this.video();
                    var seekTime = Math.max(0, Math.min(this.getDuration(), video.currentTime + 1 / this.getFPS()));
                    video.currentTime = seekTime;
                    this._showTip('下一帧');
                };

                proto.seek = function () {
                    var _engine;

                    var video = this.video();
                    var playbackRate = video.playbackRate;
                    (_engine = this._engine).seek.apply(_engine, arguments);
                    video.playbackRate = playbackRate;
                };

                proto.stepSeek = function (stepTime) {
                    var seekTime = Math.max(0, Math.min(this.getDuration(), this.getCurrenttime() + stepTime));
                    var msg = void 0;

                    if (Math.abs(stepTime) < 60) {
                        msg = stepTime > 0 ? `步进：${stepTime}秒` : `步退：${Math.abs(stepTime)}秒`;
                    } else {
                        msg = stepTime > 0 ? `步进：${stepTime / 60}分钟` : `步退：${Math.abs(stepTime) / 60}分钟`;
                    }
                    this._showTip(msg);

                    this.seek(seekTime, true);
                };

                proto.rangeSeek = function (range) {
                    var duration = this.getDuration();
                    var seekTime = Math.max(0, Math.min(duration, duration * range));
                    this.seek(seekTime, true);
                    this._showTip('定位：' + (range * 100).toFixed(0) + '%');
                };

                proto.toggleMute = function () {
                    if (this.getMuted()) {
                        this.setMuted(false);
                        this._showTip('取消静音');
                    } else {
                        this.setMuted(true);
                        this._showTip('静音');
                    }
                };

                proto.adjustVolume = function (value) {
                    var volume = this.getVolume() + value;
                    volume = Math.max(0, Math.min(1, volume.toFixed(2)));
                    this.setVolume(volume);
                    this.fire({ type: 'keyvolumechange' });
                };

                proto.getPlaybackRate = function () {
                    // iqiyi 的这个方法有bug，没把值返回！
                    return this._engine.getPlaybackRate();
                };

                proto.adjustPlaybackRate = function (value) {
                    var currRate = this.getPlaybackRate();
                    var rate = Math.max(0.2, Math.min(5, parseFloat((currRate + value).toFixed(1))));

                    localStorage.setItem('QiyiPlayerPlaybackRate', rate);
                    this.setPlaybackRate(rate);
                    this._showTip(`播放速率：${rate}`);
                };

                proto.turnPlaybackRate = function () {
                    var currRate = this.getPlaybackRate();
                    var rate = void 0;
                    if (currRate !== 1) {
                        this._backRate = currRate;
                        rate = 1;
                    } else {
                        rate = this._backRate || 1;
                    }

                    this.setPlaybackRate(rate);
                    this._showTip(`播放速率：${rate}`);
                };

                proto.hasPrevVideo = function () {
                    return this._getVideoIndexInList(this._movieinfo.tvid) > 0 || this._getVideoIndexInList(this._movieinfo.oldTvid) > 0;
                };

                proto.playNext = function () {
                    if (this.hasNextVideo()) {
                        this._showTip('播放下一集');
                        this.switchNextVideo();
                    } else {
                        this._showTip('没有下一集哦');
                    }
                };

                proto.playPrev = function () {
                    if (this.hasPrevVideo()) {
                        this._showTip('播放上一集');
                        this.switchPreVideo();
                    } else {
                        this._showTip('没有上一集哦');
                    }
                };

                _logger2.default.info('core 补丁已安装');
            });
        }
    }]);

    return CorePatch;
}(Patch);

var corePatch = new CorePatch();

var KeyShortcutsPatch = function (_Patch6) {
    _inherits(KeyShortcutsPatch, _Patch6);

    function KeyShortcutsPatch() {
        _classCallCheck(this, KeyShortcutsPatch);

        return _possibleConstructorReturn(this, (KeyShortcutsPatch.__proto__ || Object.getPrototypeOf(KeyShortcutsPatch)).call(this));
    }

    _createClass(KeyShortcutsPatch, [{
        key: '_prepare',
        value: function _prepare() {
            corePatch.install();
        }
    }, {
        key: '_apply',
        value: function _apply() {
            _hooker2.default.hookPluginHotKeys(function (exports) {
                var proto = exports.prototype;

                proto.init = function () {
                    document.addEventListener('keydown', this._keydown.bind(this));
                };

                proto._isValidTarget = function (target) {
                    return target.nodeName === 'BODY' || target.nodeName == 'VIDEO' || target.classList.contains('pw-video'); // 全局
                    // return target.nodeName === 'VIDEO' || target.classList.contains('pw-video'); // 非全局
                };

                proto._keydown = function (event) {
                    if (!this._isValidTarget(event.target)) return;

                    var keyCode = event.keyCode,
                        ctrlKey = event.ctrlKey,
                        shiftKey = event.shiftKey,
                        altKey = event.altKey;

                    var core = this.core;

                    switch (keyCode) {
                        case 32:
                            // Spacebar
                            if (!ctrlKey && !shiftKey && !altKey) {
                                if (core.isPaused()) {
                                    core.play(true);
                                    core._showTip('播放');
                                } else {
                                    core.pause(true);
                                    core._showTip('暂停');
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
                                if (!ctrlKey && !shiftKey && !altKey) {
                                    stepTime = 39 === keyCode ? 5 : -5;
                                } else if (ctrlKey && !shiftKey && !altKey) {
                                    stepTime = 39 === keyCode ? 30 : -30;
                                } else if (!ctrlKey && shiftKey && !altKey) {
                                    stepTime = 39 === keyCode ? 60 : -60;
                                } else if (ctrlKey && !shiftKey && altKey) {
                                    stepTime = 39 === keyCode ? 3e2 : -3e2; // 5分钟
                                } else {
                                    return;
                                }

                                core.stepSeek(stepTime);
                                break;
                            }
                        case 38: // ↑ Arrow Up
                        case 40:
                            // ↓ Arrow Down
                            if (!ctrlKey && !shiftKey && !altKey) {
                                core.adjustVolume(38 === keyCode ? 0.05 : -0.05);
                            } else {
                                return;
                            }
                            break;
                        case 77:
                            // M
                            if (!ctrlKey && !shiftKey && !altKey) {
                                core.toggleMute();
                            } else {
                                return;
                            }
                            break;
                        case 13:
                            // Enter
                            if (!ctrlKey && !shiftKey && !altKey) {
                                _fullscreen.fullscreen.toggle();
                            } else if (ctrlKey && !shiftKey && !altKey) {
                                _webFullscreen.webFullscreen.toggle();
                            } else {
                                return;
                            }
                            break;
                        case 67: // C
                        case 88:
                            // X
                            if (!ctrlKey && !shiftKey && !altKey) {
                                core.adjustPlaybackRate(67 === keyCode ? 0.1 : -0.1);
                            } else {
                                return;
                            }
                            break;
                        case 90:
                            // Z
                            if (!ctrlKey && !shiftKey && !altKey) {
                                core.turnPlaybackRate();
                            } else {
                                return;
                            }
                            break;
                        case 68: // D
                        case 70:
                            // F
                            if (!ctrlKey && !shiftKey && !altKey) {
                                core.pause(true);
                                if (keyCode === 68) {
                                    core.prevFrame();
                                } else {
                                    core.nextFrame();
                                }
                            } else {
                                return;
                            }
                            break;
                        case 80: // P
                        case 78:
                            // N
                            if (!ctrlKey && shiftKey && !altKey) {
                                if (keyCode === 78) {
                                    core.playNext();
                                } else {
                                    core.playPrev();
                                }
                            } else {
                                return;
                            }
                            break;
                        case 27:
                            // ESC
                            if (!event.ctrlKey && !event.shiftKey && !event.altKey) _webFullscreen.webFullscreen.isWebFullScreen() && _webFullscreen.webFullscreen.exit();
                            return;
                        default:
                            if (keyCode >= 48 && keyCode <= 57) {
                                // 0 ~ 9
                                if (!ctrlKey && !shiftKey && !altKey) {
                                    core.rangeSeek((keyCode - 48) * 0.1);
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

                _logger2.default.info('键盘快捷键已添加');
            });
        }
    }]);

    return KeyShortcutsPatch;
}(Patch);

var MouseShortcutsPatch = function (_Patch7) {
    _inherits(MouseShortcutsPatch, _Patch7);

    function MouseShortcutsPatch() {
        _classCallCheck(this, MouseShortcutsPatch);

        return _possibleConstructorReturn(this, (MouseShortcutsPatch.__proto__ || Object.getPrototypeOf(MouseShortcutsPatch)).call(this));
    }

    _createClass(MouseShortcutsPatch, [{
        key: '_prepare',
        value: function _prepare() {
            corePatch.install();
        }
    }, {
        key: '_apply',
        value: function _apply() {
            _hooker2.default.hookDefaultSkin(function (exports) {
                exports.prototype._initDBClicks = function () {
                    var timer = void 0,
                        core = this.core;
                    this.videoWrapper.find('video').on('click', function () {
                        if (timer) {
                            clearTimeout(timer);
                            timer = null;
                            return;
                        }
                        timer = setTimeout(function () {
                            if (core.isPaused()) {
                                core.play(true);
                            } else {
                                core.pause(true);
                            }
                            timer = null;
                        }, 200);
                    }).on('dblclick', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        if (event.ctrlKey) {
                            _webFullscreen.webFullscreen.toggle();
                        } else {
                            _fullscreen.fullscreen.toggle();
                        }
                    }).on('wheel', function (event) {
                        if (_fullscreen.fullscreen.isFullScreen() || _webFullscreen.webFullscreen.isWebFullScreen()) {
                            var delta = event.wheelDelta || event.detail || event.deltaY && -event.deltaY;
                            core.adjustVolume(delta > 0 ? 0.05 : -0.05);
                        }
                    });
                };

                _logger2.default.info('鼠标快捷键已添加');
            });
        }
    }]);

    return MouseShortcutsPatch;
}(Patch);

var UseWebSocketLoaderPatch = function (_Patch8) {
    _inherits(UseWebSocketLoaderPatch, _Patch8);

    function UseWebSocketLoaderPatch() {
        _classCallCheck(this, UseWebSocketLoaderPatch);

        return _possibleConstructorReturn(this, (UseWebSocketLoaderPatch.__proto__ || Object.getPrototypeOf(UseWebSocketLoaderPatch)).call(this));
    }

    _createClass(UseWebSocketLoaderPatch, [{
        key: '_apply',
        value: function _apply() {
            _hooker2.default.hookFragment(function (exports) {
                Reflect.defineProperty(exports.prototype, 'tryWS', {
                    get: function get() {
                        return true;
                    },
                    set: function set() {}
                });
                _logger2.default.info('默认使用WebSocket loader');
            });
        }
    }]);

    return UseWebSocketLoaderPatch;
}(Patch);

var vipPatch = exports.vipPatch = new VipPatch();
var adsPatch = exports.adsPatch = new AdsPatch();
var watermarksPatch = exports.watermarksPatch = new WatermarksPatch();
var checkPluginPatch = exports.checkPluginPatch = new CheckPluginPatch();
var keyShortcutsPatch = exports.keyShortcutsPatch = new KeyShortcutsPatch();
var mouseShortcutsPatch = exports.mouseShortcutsPatch = new MouseShortcutsPatch();
var useWebSocketLoaderPatch = exports.useWebSocketLoaderPatch = new UseWebSocketLoaderPatch();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fullscreen = undefined;

var _hooker = __webpack_require__(0);

var _hooker2 = _interopRequireDefault(_hooker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fullscreen = void 0;
_hooker2.default.hookFullScreen(function (_exports) {
  return exports.fullscreen = fullscreen = _exports;
});

exports.fullscreen = fullscreen;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webFullscreen = undefined;

var _hooker = __webpack_require__(0);

var _hooker2 = _interopRequireDefault(_hooker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webFullscreen = void 0;
_hooker2.default.hookWebFullScreen(function (_exports) {
  return exports.webFullscreen = webFullscreen = _exports;
});

exports.webFullscreen = webFullscreen;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flvInfo = undefined;

var _hooker = __webpack_require__(0);

var _hooker2 = _interopRequireDefault(_hooker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var flvInfo = void 0;
_hooker2.default.hookParseData(function (that) {
  return exports.flvInfo = flvInfo = that.flvInfo;
});

exports.flvInfo = flvInfo;

/***/ })
/******/ ]);