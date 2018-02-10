
// ==UserScript==
// @name         iqiyi-player-switch
// @namespace    https://github.com/gooyie/userscript-iqiyi-player-switch
// @homepageURL  https://github.com/gooyie/userscript-iqiyi-player-switch
// @supportURL   https://github.com/gooyie/userscript-iqiyi-player-switch/issues
// @updateURL    https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/dist/iqiyi-player-switch.user.js
// @description  爱奇艺flash播放器与html5播放器随意切换，改善html5播放器播放体验。
// @version      1.12.2
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var required = __webpack_require__(11)
  , lolcation = __webpack_require__(12)
  , qs = __webpack_require__(13)
  , relativere = /^\/(?!\/)/;

/**
 * These are the parse instructions for the URL parsers, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var instructions = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  ['//', 'protocol', 2, 1, 1],          // Extract from the front.
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/\:(\d+)$/, 'port'],                 // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my CDO.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Boolean|function} parser Parser for the query string.
 * @param {Object} location Location defaults for relative paths.
 * @api public
 */
function URL(address, location, parser) {
  if (!(this instanceof URL)) {
    return new URL(address, location, parser);
  }

  var relative = relativere.test(address)
    , parse, instruction, index, key
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) {
    parser = qs.parse;
  }

  location = lolcation(location);

  for (; i < instructions.length; i++) {
    instruction = instructions[i];
    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if (index = parse.exec(address)) {
      url[key] = index[1];
      address = address.slice(0, address.length - index[0].length);
    }

    url[key] = url[key] || (instruction[3] || ('port' === key && relative) ? location[key] || '' : '');

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) {
      url[key] = url[key].toLowerCase();
    }
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} prop Property we need to adjust.
 * @param {Mixed} value The newly assigned value.
 * @returns {URL}
 * @api public
 */
URL.prototype.set = function set(part, value, fn) {
  var url = this;

  if ('query' === part) {
    if ('string' === typeof value && value.length) {
      value = (fn || qs.parse)(value);
    }

    url[part] = value;
  } else if ('port' === part) {
    url[part] = value;

    if (!required(value, url.protocol)) {
      url.host = url.hostname;
      url[part] = '';
    } else if (value) {
      url.host = url.hostname +':'+ value;
    }
  } else if ('hostname' === part) {
    url[part] = value;

    if (url.port) value += ':'+ url.port;
    url.host = value;
  } else if ('host' === part) {
    url[part] = value;

    if (/\:\d+/.test(value)) {
      value = value.split(':');
      url.hostname = value[0];
      url.port = value[1];
    }
  } else {
    url[part] = value;
  }

  url.href = url.toString();
  return url;
};

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String}
 * @api public
 */
URL.prototype.toString = function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , result = url.protocol +'//';

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.hostname;
  if (url.port) result += ':'+ url.port;

  result += url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
};

//
// Expose the URL parser and some additional properties that might be useful for
// others.
//
URL.qs = qs;
URL.location = lolcation;
module.exports = URL;


/***/ }),
/* 5 */
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
            var UA_CHROME = 'chrome';
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

__webpack_require__(7);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _cookies = __webpack_require__(14);

var _cookies2 = _interopRequireDefault(_cookies);

var _detector = __webpack_require__(3);

var _detector2 = _interopRequireDefault(_detector);

var _hooker = __webpack_require__(0);

var _hooker2 = _interopRequireDefault(_hooker);

var _faker = __webpack_require__(5);

var _faker2 = _interopRequireDefault(_faker);

var _outsite = __webpack_require__(15);

var _patch = __webpack_require__(20);

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

function autoFallback() {
    if (_detector2.default.isSupportVms()) {
        // vms f4v(flv)
        if (!_detector2.default.isChrome()) {
            _faker2.default.fakeChrome();
        }
    } else if (_detector2.default.isSupportM3u8()) {
        // tmts m3u8
        _faker2.default.fakeMacPlatform();
        _faker2.default.fakeSafari();
    } else {
        // by default, tmts mp4 ...
    }
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
            autoFallback();

            _patch.adsPatch.install();
            _patch.watermarksPatch.install();
            _patch.vipPatch.install();
            _patch.checkPluginPatch.install();
            _patch.keyShortcutsPatch.install();
            _patch.mouseShortcutsPatch.install();
            _patch.useWebSocketLoaderPatch.install();

            if (_detector2.default.isInnerFrame()) (0, _outsite.adaptIframe)();
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(8);

var _src = __webpack_require__(9);

var _src2 = _interopRequireDefault(_src);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _detector = __webpack_require__(3);

var _detector2 = _interopRequireDefault(_detector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isVideoReq(url) {
    var u = new URL(url);
    return u.pathname.startsWith('/videos/') && u.pathname.endsWith('.f4v');
}

if (_detector2.default.isFirefox()) {
    var fetch = unsafeWindow.fetch.bind(unsafeWindow);

    unsafeWindow.fetch = function (url, opts) {
        if (isVideoReq(url)) {
            _logger2.default.info(`fetching stream ${url}`);
            return (0, _src2.default)(url, opts).then(function (res) {
                if (!res.ok) {
                    // 出错
                    throw new TypeError('Failed to fetch'); // 则切换到 WebSocket loader
                }
                return res;
            });
        } else {
            return fetch(url, opts);
        }
    };
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.default = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _require=_dereq_("./spec/reference-implementation/lib/readable-stream"),ReadableStream=_require.ReadableStream,_require2=_dereq_("./spec/reference-implementation/lib/writable-stream"),WritableStream=_require2.WritableStream,ByteLengthQueuingStrategy=_dereq_("./spec/reference-implementation/lib/byte-length-queuing-strategy"),CountQueuingStrategy=_dereq_("./spec/reference-implementation/lib/count-queuing-strategy"),TransformStream=_dereq_("./spec/reference-implementation/lib/transform-stream").TransformStream;exports.ByteLengthQueuingStrategy=ByteLengthQueuingStrategy,exports.CountQueuingStrategy=CountQueuingStrategy,exports.TransformStream=TransformStream,exports.ReadableStream=ReadableStream,exports.WritableStream=WritableStream;var interfaces={ReadableStream:ReadableStream,WritableStream:WritableStream,ByteLengthQueuingStrategy:ByteLengthQueuingStrategy,CountQueuingStrategy:CountQueuingStrategy,TransformStream:TransformStream};exports.default=interfaces,"undefined"!=typeof window&&Object.assign(window,interfaces);

},{"./spec/reference-implementation/lib/byte-length-queuing-strategy":3,"./spec/reference-implementation/lib/count-queuing-strategy":4,"./spec/reference-implementation/lib/readable-stream":7,"./spec/reference-implementation/lib/transform-stream":8,"./spec/reference-implementation/lib/writable-stream":9}],2:[function(_dereq_,module,exports){

},{}],3:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var a=r[t];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(r,t,a){return t&&e(r.prototype,t),a&&e(r,a),r}}(),_require=_dereq_("./helpers.js"),createDataProperty=_require.createDataProperty;module.exports=function(){function e(r){var t=r.highWaterMark;_classCallCheck(this,e),createDataProperty(this,"highWaterMark",t)}return _createClass(e,[{key:"size",value:function(e){return e.byteLength}}]),e}();

},{"./helpers.js":5}],4:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var a=r[t];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(r,t,a){return t&&e(r.prototype,t),a&&e(r,a),r}}(),_require=_dereq_("./helpers.js"),createDataProperty=_require.createDataProperty;module.exports=function(){function e(r){var t=r.highWaterMark;_classCallCheck(this,e),createDataProperty(this,"highWaterMark",t)}return _createClass(e,[{key:"size",value:function(){return 1}}]),e}();

},{"./helpers.js":5}],5:[function(_dereq_,module,exports){
"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function IsPropertyKey(e){return"string"==typeof e||"symbol"===("undefined"==typeof e?"undefined":_typeof(e))}function Call(e,r,t){if("function"!=typeof e)throw new TypeError("Argument is not a function");return Function.prototype.apply.call(e,r,t)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};exports.typeIsObject=function(e){return"object"===("undefined"==typeof e?"undefined":_typeof(e))&&null!==e||"function"==typeof e},exports.createDataProperty=function(e,r,t){Object.defineProperty(e,r,{value:t,writable:!0,enumerable:!0,configurable:!0})},exports.createArrayFromList=function(e){return e.slice()},exports.ArrayBufferCopy=function(e,r,t,o,n){new Uint8Array(e).set(new Uint8Array(t,o,n),r)},exports.CreateIterResultObject=function(e,r){var t={};return Object.defineProperty(t,"value",{value:e,enumerable:!0,writable:!0,configurable:!0}),Object.defineProperty(t,"done",{value:r,enumerable:!0,writable:!0,configurable:!0}),t},exports.IsFiniteNonNegativeNumber=function(e){return!Number.isNaN(e)&&(e!==1/0&&!(e<0))},exports.InvokeOrNoop=function(e,r,t){var o=e[r];if(void 0!==o)return Call(o,e,t)},exports.PromiseInvokeOrNoop=function(e,r,t){try{return Promise.resolve(exports.InvokeOrNoop(e,r,t))}catch(e){return Promise.reject(e)}},exports.PromiseInvokeOrPerformFallback=function(e,r,t,o,n){var i=void 0;try{i=e[r]}catch(e){return Promise.reject(e)}if(void 0===i)return o.apply(void 0,_toConsumableArray(n));try{return Promise.resolve(Call(i,e,t))}catch(e){return Promise.reject(e)}},exports.PromiseInvokeOrFallbackOrNoop=function(e,r,t,o,n){return exports.PromiseInvokeOrPerformFallback(e,r,t,exports.PromiseInvokeOrNoop,[e,o,n])},exports.SameRealmTransfer=function(e){return e},exports.ValidateAndNormalizeHighWaterMark=function(e){if(e=Number(e),Number.isNaN(e)||e<0)throw new RangeError("highWaterMark property of a queuing strategy must be non-negative and non-NaN");return e},exports.ValidateAndNormalizeQueuingStrategy=function(e,r){if(void 0!==e&&"function"!=typeof e)throw new TypeError("size property of a queuing strategy must be a function");return r=exports.ValidateAndNormalizeHighWaterMark(r),{size:e,highWaterMark:r}};

},{}],6:[function(_dereq_,module,exports){
"use strict";var _require=_dereq_("./helpers.js"),IsFiniteNonNegativeNumber=_require.IsFiniteNonNegativeNumber;exports.DequeueValue=function(e){var t=e.shift();return e._totalSize-=t.size,t.value},exports.EnqueueValueWithSize=function(e,t,i){if(i=Number(i),!IsFiniteNonNegativeNumber(i))throw new RangeError("Size must be a finite, non-NaN, non-negative number.");e.push({value:t,size:i}),void 0===e._totalSize&&(e._totalSize=0),e._totalSize+=i},exports.GetTotalQueueSize=function(e){return void 0===e._totalSize&&(e._totalSize=0),e._totalSize},exports.PeekQueueValue=function(e){var t=e[0];return t.value};

},{"./helpers.js":5}],7:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function AcquireReadableStreamBYOBReader(e){return new ReadableStreamBYOBReader(e)}function AcquireReadableStreamDefaultReader(e){return new ReadableStreamDefaultReader(e)}function IsReadableStream(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readableStreamController")}function IsReadableStreamDisturbed(e){return e._disturbed}function IsReadableStreamLocked(e){return void 0!==e._reader}function ReadableStreamTee(e,r){var t=AcquireReadableStreamDefaultReader(e),a={closedOrErrored:!1,canceled1:!1,canceled2:!1,reason1:void 0,reason2:void 0};a.promise=new Promise(function(e){a._resolve=e});var l=create_ReadableStreamTeePullFunction();l._reader=t,l._teeState=a,l._cloneForBranch2=r;var o=create_ReadableStreamTeeBranch1CancelFunction();o._stream=e,o._teeState=a;var n=create_ReadableStreamTeeBranch2CancelFunction();n._stream=e,n._teeState=a;var i=Object.create(Object.prototype);createDataProperty(i,"pull",l),createDataProperty(i,"cancel",o);var d=new ReadableStream(i),s=Object.create(Object.prototype);createDataProperty(s,"pull",l),createDataProperty(s,"cancel",n);var u=new ReadableStream(s);return l._branch1=d._readableStreamController,l._branch2=u._readableStreamController,t._closedPromise.catch(function(e){a.closedOrErrored!==!0&&(ReadableStreamDefaultControllerError(l._branch1,e),ReadableStreamDefaultControllerError(l._branch2,e),a.closedOrErrored=!0)}),[d,u]}function create_ReadableStreamTeePullFunction(){function e(){var r=e._reader,t=e._branch1,a=e._branch2,l=e._teeState;return ReadableStreamDefaultReaderRead(r).then(function(e){var r=e.value,o=e.done;if(o===!0&&l.closedOrErrored===!1&&(l.canceled1===!1&&ReadableStreamDefaultControllerClose(t),l.canceled2===!1&&ReadableStreamDefaultControllerClose(a),l.closedOrErrored=!0),l.closedOrErrored!==!0){var n=r,i=r;l.canceled1===!1&&ReadableStreamDefaultControllerEnqueue(t,n),l.canceled2===!1&&ReadableStreamDefaultControllerEnqueue(a,i)}})}return e}function create_ReadableStreamTeeBranch1CancelFunction(){function e(r){var t=e._stream,a=e._teeState;if(a.canceled1=!0,a.reason1=r,a.canceled2===!0){var l=createArrayFromList([a.reason1,a.reason2]),o=ReadableStreamCancel(t,l);a._resolve(o)}return a.promise}return e}function create_ReadableStreamTeeBranch2CancelFunction(){function e(r){var t=e._stream,a=e._teeState;if(a.canceled2=!0,a.reason2=r,a.canceled1===!0){var l=createArrayFromList([a.reason1,a.reason2]),o=ReadableStreamCancel(t,l);a._resolve(o)}return a.promise}return e}function ReadableStreamAddReadIntoRequest(e){var r=new Promise(function(r,t){var a={_resolve:r,_reject:t};e._reader._readIntoRequests.push(a)});return r}function ReadableStreamAddReadRequest(e){var r=new Promise(function(r,t){var a={_resolve:r,_reject:t};e._reader._readRequests.push(a)});return r}function ReadableStreamCancel(e,r){if(e._disturbed=!0,"closed"===e._state)return Promise.resolve(void 0);if("errored"===e._state)return Promise.reject(e._storedError);ReadableStreamClose(e);var t=e._readableStreamController[InternalCancel](r);return t.then(function(){})}function ReadableStreamClose(e){e._state="closed";var r=e._reader;if(void 0!==r){if(IsReadableStreamDefaultReader(r)===!0){var t=!0,a=!1,l=void 0;try{for(var o,n=r._readRequests[Symbol.iterator]();!(t=(o=n.next()).done);t=!0){var i=o.value._resolve;i(CreateIterResultObject(void 0,!0))}}catch(e){a=!0,l=e}finally{try{!t&&n.return&&n.return()}finally{if(a)throw l}}r._readRequests=[]}defaultReaderClosedPromiseResolve(r)}}function ReadableStreamError(e,r){e._state="errored",e._storedError=r;var t=e._reader;if(void 0!==t){if(IsReadableStreamDefaultReader(t)===!0){var a=!0,l=!1,o=void 0;try{for(var n,i=t._readRequests[Symbol.iterator]();!(a=(n=i.next()).done);a=!0){var d=n.value;d._reject(r)}}catch(e){l=!0,o=e}finally{try{!a&&i.return&&i.return()}finally{if(l)throw o}}t._readRequests=[]}else{var s=!0,u=!1,c=void 0;try{for(var b,R=t._readIntoRequests[Symbol.iterator]();!(s=(b=R.next()).done);s=!0){var m=b.value;m._reject(r)}}catch(e){u=!0,c=e}finally{try{!s&&R.return&&R.return()}finally{if(u)throw c}}t._readIntoRequests=[]}defaultReaderClosedPromiseReject(t,r),t._closedPromise.catch(function(){})}}function ReadableStreamFulfillReadIntoRequest(e,r,t){var a=e._reader,l=a._readIntoRequests.shift();l._resolve(CreateIterResultObject(r,t))}function ReadableStreamFulfillReadRequest(e,r,t){var a=e._reader,l=a._readRequests.shift();l._resolve(CreateIterResultObject(r,t))}function ReadableStreamGetNumReadIntoRequests(e){return e._reader._readIntoRequests.length}function ReadableStreamGetNumReadRequests(e){return e._reader._readRequests.length}function ReadableStreamHasBYOBReader(e){var r=e._reader;return void 0!==r&&IsReadableStreamBYOBReader(r)!==!1}function ReadableStreamHasDefaultReader(e){var r=e._reader;return void 0!==r&&IsReadableStreamDefaultReader(r)!==!1}function IsReadableStreamBYOBReader(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readIntoRequests")}function IsReadableStreamDefaultReader(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readRequests")}function ReadableStreamReaderGenericInitialize(e,r){e._ownerReadableStream=r,r._reader=e,"readable"===r._state?defaultReaderClosedPromiseInitialize(e):"closed"===r._state?defaultReaderClosedPromiseInitializeAsResolved(e):(defaultReaderClosedPromiseInitializeAsRejected(e,r._storedError),e._closedPromise.catch(function(){}))}function ReadableStreamReaderGenericCancel(e,r){var t=e._ownerReadableStream;return ReadableStreamCancel(t,r)}function ReadableStreamReaderGenericRelease(e){"readable"===e._ownerReadableStream._state?defaultReaderClosedPromiseReject(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")):defaultReaderClosedPromiseResetToRejected(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")),e._closedPromise.catch(function(){}),e._ownerReadableStream._reader=void 0,e._ownerReadableStream=void 0}function ReadableStreamBYOBReaderRead(e,r){var t=e._ownerReadableStream;return t._disturbed=!0,"errored"===t._state?Promise.reject(t._storedError):ReadableByteStreamControllerPullInto(t._readableStreamController,r)}function ReadableStreamDefaultReaderRead(e){var r=e._ownerReadableStream;return r._disturbed=!0,"closed"===r._state?Promise.resolve(CreateIterResultObject(void 0,!0)):"errored"===r._state?Promise.reject(r._storedError):r._readableStreamController[InternalPull]()}function IsReadableStreamDefaultController(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_underlyingSource")}function ReadableStreamDefaultControllerCallPullIfNeeded(e){var r=ReadableStreamDefaultControllerShouldCallPull(e);if(r!==!1){if(e._pulling===!0)return void(e._pullAgain=!0);e._pulling=!0;var t=PromiseInvokeOrNoop(e._underlyingSource,"pull",[e]);t.then(function(){if(e._pulling=!1,e._pullAgain===!0)return e._pullAgain=!1,ReadableStreamDefaultControllerCallPullIfNeeded(e)},function(r){ReadableStreamDefaultControllerErrorIfNeeded(e,r)}).catch(rethrowAssertionErrorRejection)}}function ReadableStreamDefaultControllerShouldCallPull(e){var r=e._controlledReadableStream;if("closed"===r._state||"errored"===r._state)return!1;if(e._closeRequested===!0)return!1;if(e._started===!1)return!1;if(IsReadableStreamLocked(r)===!0&&ReadableStreamGetNumReadRequests(r)>0)return!0;var t=ReadableStreamDefaultControllerGetDesiredSize(e);return t>0}function ReadableStreamDefaultControllerClose(e){var r=e._controlledReadableStream;e._closeRequested=!0,0===e._queue.length&&ReadableStreamClose(r)}function ReadableStreamDefaultControllerEnqueue(e,r){var t=e._controlledReadableStream;if(IsReadableStreamLocked(t)===!0&&ReadableStreamGetNumReadRequests(t)>0)ReadableStreamFulfillReadRequest(t,r,!1);else{var a=1;if(void 0!==e._strategySize)try{a=e._strategySize(r)}catch(r){throw ReadableStreamDefaultControllerErrorIfNeeded(e,r),r}try{EnqueueValueWithSize(e._queue,r,a)}catch(r){throw ReadableStreamDefaultControllerErrorIfNeeded(e,r),r}}ReadableStreamDefaultControllerCallPullIfNeeded(e)}function ReadableStreamDefaultControllerError(e,r){var t=e._controlledReadableStream;e._queue=[],ReadableStreamError(t,r)}function ReadableStreamDefaultControllerErrorIfNeeded(e,r){"readable"===e._controlledReadableStream._state&&ReadableStreamDefaultControllerError(e,r)}function ReadableStreamDefaultControllerGetDesiredSize(e){var r=GetTotalQueueSize(e._queue);return e._strategyHWM-r}function IsReadableByteStreamController(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_underlyingByteSource")}function IsReadableStreamBYOBRequest(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_associatedReadableByteStreamController")}function ReadableByteStreamControllerCallPullIfNeeded(e){var r=ReadableByteStreamControllerShouldCallPull(e);if(r!==!1){if(e._pulling===!0)return void(e._pullAgain=!0);e._pulling=!0;var t=PromiseInvokeOrNoop(e._underlyingByteSource,"pull",[e]);t.then(function(){e._pulling=!1,e._pullAgain===!0&&(e._pullAgain=!1,ReadableByteStreamControllerCallPullIfNeeded(e))},function(r){"readable"===e._controlledReadableStream._state&&ReadableByteStreamControllerError(e,r)}).catch(rethrowAssertionErrorRejection)}}function ReadableByteStreamControllerClearPendingPullIntos(e){ReadableByteStreamControllerInvalidateBYOBRequest(e),e._pendingPullIntos=[]}function ReadableByteStreamControllerCommitPullIntoDescriptor(e,r){var t=!1;"closed"===e._state&&(t=!0);var a=ReadableByteStreamControllerConvertPullIntoDescriptor(r);"default"===r.readerType?ReadableStreamFulfillReadRequest(e,a,t):ReadableStreamFulfillReadIntoRequest(e,a,t)}function ReadableByteStreamControllerConvertPullIntoDescriptor(e){var r=e.bytesFilled,t=e.elementSize;return new e.ctor(e.buffer,e.byteOffset,r/t)}function ReadableByteStreamControllerEnqueueChunkToQueue(e,r,t,a){e._queue.push({buffer:r,byteOffset:t,byteLength:a}),e._totalQueuedBytes+=a}function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(e,r){var t=r.elementSize,a=r.bytesFilled-r.bytesFilled%t,l=Math.min(e._totalQueuedBytes,r.byteLength-r.bytesFilled),o=r.bytesFilled+l,n=o-o%t,i=l,d=!1;n>a&&(i=n-r.bytesFilled,d=!0);for(var s=e._queue;i>0;){var u=s[0],c=Math.min(i,u.byteLength),b=r.byteOffset+r.bytesFilled;ArrayBufferCopy(r.buffer,b,u.buffer,u.byteOffset,c),u.byteLength===c?s.shift():(u.byteOffset+=c,u.byteLength-=c),e._totalQueuedBytes-=c,ReadableByteStreamControllerFillHeadPullIntoDescriptor(e,c,r),i-=c}return d}function ReadableByteStreamControllerFillHeadPullIntoDescriptor(e,r,t){ReadableByteStreamControllerInvalidateBYOBRequest(e),t.bytesFilled+=r}function ReadableByteStreamControllerHandleQueueDrain(e){0===e._totalQueuedBytes&&e._closeRequested===!0?ReadableStreamClose(e._controlledReadableStream):ReadableByteStreamControllerCallPullIfNeeded(e)}function ReadableByteStreamControllerInvalidateBYOBRequest(e){void 0!==e._byobRequest&&(e._byobRequest._associatedReadableByteStreamController=void 0,e._byobRequest._view=void 0,e._byobRequest=void 0)}function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(e){for(;e._pendingPullIntos.length>0;){if(0===e._totalQueuedBytes)return;var r=e._pendingPullIntos[0];ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(e,r)===!0&&(ReadableByteStreamControllerShiftPendingPullInto(e),ReadableByteStreamControllerCommitPullIntoDescriptor(e._controlledReadableStream,r))}}function ReadableByteStreamControllerPullInto(e,r){var t=e._controlledReadableStream,a=1;r.constructor!==DataView&&(a=r.constructor.BYTES_PER_ELEMENT);var l=r.constructor,o={buffer:r.buffer,byteOffset:r.byteOffset,byteLength:r.byteLength,bytesFilled:0,elementSize:a,ctor:l,readerType:"byob"};if(e._pendingPullIntos.length>0)return o.buffer=SameRealmTransfer(o.buffer),e._pendingPullIntos.push(o),ReadableStreamAddReadIntoRequest(t);if("closed"===t._state){var n=new r.constructor(r.buffer,r.byteOffset,0);return Promise.resolve(CreateIterResultObject(n,!0))}if(e._totalQueuedBytes>0){if(ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(e,o)===!0){var i=ReadableByteStreamControllerConvertPullIntoDescriptor(o);return ReadableByteStreamControllerHandleQueueDrain(e),Promise.resolve(CreateIterResultObject(i,!1))}if(e._closeRequested===!0){var d=new TypeError("Insufficient bytes to fill elements in the given buffer");return ReadableByteStreamControllerError(e,d),Promise.reject(d)}}o.buffer=SameRealmTransfer(o.buffer),e._pendingPullIntos.push(o);var s=ReadableStreamAddReadIntoRequest(t);return ReadableByteStreamControllerCallPullIfNeeded(e),s}function ReadableByteStreamControllerRespondInClosedState(e,r){r.buffer=SameRealmTransfer(r.buffer);for(var t=e._controlledReadableStream;ReadableStreamGetNumReadIntoRequests(t)>0;){var a=ReadableByteStreamControllerShiftPendingPullInto(e);ReadableByteStreamControllerCommitPullIntoDescriptor(t,a)}}function ReadableByteStreamControllerRespondInReadableState(e,r,t){if(t.bytesFilled+r>t.byteLength)throw new RangeError("bytesWritten out of range");if(ReadableByteStreamControllerFillHeadPullIntoDescriptor(e,r,t),!(t.bytesFilled<t.elementSize)){ReadableByteStreamControllerShiftPendingPullInto(e);var a=t.bytesFilled%t.elementSize;if(a>0){var l=t.byteOffset+t.bytesFilled,o=t.buffer.slice(l-a,l);ReadableByteStreamControllerEnqueueChunkToQueue(e,o,0,o.byteLength)}t.buffer=SameRealmTransfer(t.buffer),t.bytesFilled-=a,ReadableByteStreamControllerCommitPullIntoDescriptor(e._controlledReadableStream,t),ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(e)}}function ReadableByteStreamControllerRespondInternal(e,r){var t=e._pendingPullIntos[0],a=e._controlledReadableStream;if("closed"===a._state){if(0!==r)throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");ReadableByteStreamControllerRespondInClosedState(e,t)}else ReadableByteStreamControllerRespondInReadableState(e,r,t)}function ReadableByteStreamControllerShiftPendingPullInto(e){var r=e._pendingPullIntos.shift();return ReadableByteStreamControllerInvalidateBYOBRequest(e),r}function ReadableByteStreamControllerShouldCallPull(e){var r=e._controlledReadableStream;return"readable"===r._state&&(e._closeRequested!==!0&&(e._started!==!1&&(!!(ReadableStreamHasDefaultReader(r)&&ReadableStreamGetNumReadRequests(r)>0)||(!!(ReadableStreamHasBYOBReader(r)&&ReadableStreamGetNumReadIntoRequests(r)>0)||ReadableByteStreamControllerGetDesiredSize(e)>0))))}function ReadableByteStreamControllerClose(e){var r=e._controlledReadableStream;if(e._totalQueuedBytes>0)return void(e._closeRequested=!0);if(e._pendingPullIntos.length>0){var t=e._pendingPullIntos[0];if(t.bytesFilled>0){var a=new TypeError("Insufficient bytes to fill elements in the given buffer");throw ReadableByteStreamControllerError(e,a),a}}ReadableStreamClose(r)}function ReadableByteStreamControllerEnqueue(e,r){var t=e._controlledReadableStream,a=r.buffer,l=r.byteOffset,o=r.byteLength,n=SameRealmTransfer(a);if(ReadableStreamHasDefaultReader(t)===!0)if(0===ReadableStreamGetNumReadRequests(t))ReadableByteStreamControllerEnqueueChunkToQueue(e,n,l,o);else{var i=new Uint8Array(n,l,o);ReadableStreamFulfillReadRequest(t,i,!1)}else ReadableStreamHasBYOBReader(t)===!0?(ReadableByteStreamControllerEnqueueChunkToQueue(e,n,l,o),ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(e)):ReadableByteStreamControllerEnqueueChunkToQueue(e,n,l,o)}function ReadableByteStreamControllerError(e,r){var t=e._controlledReadableStream;ReadableByteStreamControllerClearPendingPullIntos(e),e._queue=[],ReadableStreamError(t,r)}function ReadableByteStreamControllerGetDesiredSize(e){return e._strategyHWM-e._totalQueuedBytes}function ReadableByteStreamControllerRespond(e,r){if(r=Number(r),IsFiniteNonNegativeNumber(r)===!1)throw new RangeError("bytesWritten must be a finite");ReadableByteStreamControllerRespondInternal(e,r)}function ReadableByteStreamControllerRespondWithNewView(e,r){var t=e._pendingPullIntos[0];if(t.byteOffset+t.bytesFilled!==r.byteOffset)throw new RangeError("The region specified by view does not match byobRequest");if(t.byteLength!==r.byteLength)throw new RangeError("The buffer of view has different capacity than byobRequest");t.buffer=r.buffer,ReadableByteStreamControllerRespondInternal(e,r.byteLength)}function streamBrandCheckException(e){return new TypeError("ReadableStream.prototype."+e+" can only be used on a ReadableStream")}function readerLockException(e){return new TypeError("Cannot "+e+" a stream using a released reader")}function defaultReaderBrandCheckException(e){return new TypeError("ReadableStreamDefaultReader.prototype."+e+" can only be used on a ReadableStreamDefaultReader")}function defaultReaderClosedPromiseInitialize(e){e._closedPromise=new Promise(function(r,t){e._closedPromise_resolve=r,e._closedPromise_reject=t})}function defaultReaderClosedPromiseInitializeAsRejected(e,r){e._closedPromise=Promise.reject(r),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultReaderClosedPromiseInitializeAsResolved(e){e._closedPromise=Promise.resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultReaderClosedPromiseReject(e,r){e._closedPromise_reject(r),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultReaderClosedPromiseResetToRejected(e,r){e._closedPromise=Promise.reject(r)}function defaultReaderClosedPromiseResolve(e){e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function byobReaderBrandCheckException(e){return new TypeError("ReadableStreamBYOBReader.prototype."+e+" can only be used on a ReadableStreamBYOBReader")}function defaultControllerBrandCheckException(e){return new TypeError("ReadableStreamDefaultController.prototype."+e+" can only be used on a ReadableStreamDefaultController")}function byobRequestBrandCheckException(e){return new TypeError("ReadableStreamBYOBRequest.prototype."+e+" can only be used on a ReadableStreamBYOBRequest")}function byteStreamControllerBrandCheckException(e){return new TypeError("ReadableByteStreamController.prototype."+e+" can only be used on a ReadableByteStreamController")}var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var a=r[t];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(r,t,a){return t&&e(r.prototype,t),a&&e(r,a),r}}(),_require=_dereq_("./helpers.js"),ArrayBufferCopy=_require.ArrayBufferCopy,CreateIterResultObject=_require.CreateIterResultObject,IsFiniteNonNegativeNumber=_require.IsFiniteNonNegativeNumber,InvokeOrNoop=_require.InvokeOrNoop,PromiseInvokeOrNoop=_require.PromiseInvokeOrNoop,SameRealmTransfer=_require.SameRealmTransfer,ValidateAndNormalizeQueuingStrategy=_require.ValidateAndNormalizeQueuingStrategy,ValidateAndNormalizeHighWaterMark=_require.ValidateAndNormalizeHighWaterMark,_require2=_dereq_("./helpers.js"),createArrayFromList=_require2.createArrayFromList,createDataProperty=_require2.createDataProperty,typeIsObject=_require2.typeIsObject,_require3=_dereq_("./utils.js"),rethrowAssertionErrorRejection=_require3.rethrowAssertionErrorRejection,_require4=_dereq_("./queue-with-sizes.js"),DequeueValue=_require4.DequeueValue,EnqueueValueWithSize=_require4.EnqueueValueWithSize,GetTotalQueueSize=_require4.GetTotalQueueSize,_require5=_dereq_("./writable-stream.js"),AcquireWritableStreamDefaultWriter=_require5.AcquireWritableStreamDefaultWriter,IsWritableStream=_require5.IsWritableStream,IsWritableStreamLocked=_require5.IsWritableStreamLocked,WritableStreamAbort=_require5.WritableStreamAbort,WritableStreamDefaultWriterCloseWithErrorPropagation=_require5.WritableStreamDefaultWriterCloseWithErrorPropagation,WritableStreamDefaultWriterRelease=_require5.WritableStreamDefaultWriterRelease,WritableStreamDefaultWriterWrite=_require5.WritableStreamDefaultWriterWrite,InternalCancel=Symbol("[[Cancel]]"),InternalPull=Symbol("[[Pull]]"),ReadableStream=function(){function e(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.size,l=t.highWaterMark;_classCallCheck(this,e),this._state="readable",this._reader=void 0,this._storedError=void 0,this._disturbed=!1,this._readableStreamController=void 0;var o=r.type,n=String(o);if("bytes"===n)void 0===l&&(l=0),this._readableStreamController=new ReadableByteStreamController(this,r,l);else{if(void 0!==o)throw new RangeError("Invalid type is specified");void 0===l&&(l=1),this._readableStreamController=new ReadableStreamDefaultController(this,r,a,l)}}return _createClass(e,[{key:"cancel",value:function(e){return IsReadableStream(this)===!1?Promise.reject(streamBrandCheckException("cancel")):IsReadableStreamLocked(this)===!0?Promise.reject(new TypeError("Cannot cancel a stream that already has a reader")):ReadableStreamCancel(this,e)}},{key:"getReader",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.mode;if(IsReadableStream(this)===!1)throw streamBrandCheckException("getReader");if("byob"===r){if(IsReadableByteStreamController(this._readableStreamController)===!1)throw new TypeError("Cannot get a ReadableStreamBYOBReader for a stream not constructed with a byte source");return AcquireReadableStreamBYOBReader(this)}if(void 0===r)return AcquireReadableStreamDefaultReader(this);throw new RangeError("Invalid mode is specified")}},{key:"pipeThrough",value:function(e,r){var t=e.writable,a=e.readable;return this.pipeTo(t,r),a}},{key:"pipeTo",value:function(e){var r=this,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.preventClose,l=t.preventAbort,o=t.preventCancel;if(IsReadableStream(this)===!1)return Promise.reject(streamBrandCheckException("pipeTo"));if(IsWritableStream(e)===!1)return Promise.reject(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));if(a=Boolean(a),l=Boolean(l),o=Boolean(o),IsReadableStreamLocked(this)===!0)return Promise.reject(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));if(IsWritableStreamLocked(e)===!0)return Promise.reject(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));var n=AcquireReadableStreamDefaultReader(this),i=AcquireWritableStreamDefaultWriter(e),d=!1,s=Promise.resolve();return new Promise(function(t,u){function c(){return s=Promise.resolve(),d===!0?Promise.resolve():i._readyPromise.then(function(){return ReadableStreamDefaultReaderRead(n).then(function(e){var r=e.value,t=e.done;if(t!==!0)return s=WritableStreamDefaultWriterWrite(i,r)})}).then(c)}function b(e,r,t){"errored"===e._state?t(e._storedError):r.catch(t).catch(rethrowAssertionErrorRejection)}function R(e,r,t){"closed"===e._state?t():r.then(t).catch(rethrowAssertionErrorRejection)}function m(){return s.catch(function(){})}function f(e,r,t){d!==!0&&(d=!0,m().then(function(){return e().then(function(){return S(r,t)},function(e){return S(!0,e)})}).catch(rethrowAssertionErrorRejection))}function h(e,r){d!==!0&&(d=!0,m().then(function(){S(e,r)}).catch(rethrowAssertionErrorRejection))}function S(e,r){WritableStreamDefaultWriterRelease(i),ReadableStreamReaderGenericRelease(n),e?u(r):t(void 0)}b(r,n._closedPromise,function(r){l===!1?f(function(){return WritableStreamAbort(e,r)},!0,r):h(!0,r)}),b(e,i._closedPromise,function(e){o===!1?f(function(){return ReadableStreamCancel(r,e)},!0,e):h(!0,e)}),R(r,n._closedPromise,function(){a===!1?f(function(){return WritableStreamDefaultWriterCloseWithErrorPropagation(i)}):h()}),"closing"!==e._state&&"closed"!==e._state||!function(){var e=new TypeError("the destination writable stream closed before all data could be piped to it");o===!1?f(function(){return ReadableStreamCancel(r,e)},!0,e):h(!0,e)}(),c().catch(function(e){s=Promise.resolve(),rethrowAssertionErrorRejection(e)})})}},{key:"tee",value:function(){if(IsReadableStream(this)===!1)throw streamBrandCheckException("tee");var e=ReadableStreamTee(this,!1);return createArrayFromList(e)}},{key:"locked",get:function(){if(IsReadableStream(this)===!1)throw streamBrandCheckException("locked");return IsReadableStreamLocked(this)}}]),e}();module.exports={ReadableStream:ReadableStream,IsReadableStreamDisturbed:IsReadableStreamDisturbed,ReadableStreamDefaultControllerClose:ReadableStreamDefaultControllerClose,ReadableStreamDefaultControllerEnqueue:ReadableStreamDefaultControllerEnqueue,ReadableStreamDefaultControllerError:ReadableStreamDefaultControllerError,ReadableStreamDefaultControllerGetDesiredSize:ReadableStreamDefaultControllerGetDesiredSize};var ReadableStreamDefaultReader=function(){function e(r){if(_classCallCheck(this,e),IsReadableStream(r)===!1)throw new TypeError("ReadableStreamDefaultReader can only be constructed with a ReadableStream instance");if(IsReadableStreamLocked(r)===!0)throw new TypeError("This stream has already been locked for exclusive reading by another reader");ReadableStreamReaderGenericInitialize(this,r),this._readRequests=[]}return _createClass(e,[{key:"cancel",value:function(e){return IsReadableStreamDefaultReader(this)===!1?Promise.reject(defaultReaderBrandCheckException("cancel")):void 0===this._ownerReadableStream?Promise.reject(readerLockException("cancel")):ReadableStreamReaderGenericCancel(this,e)}},{key:"read",value:function(){return IsReadableStreamDefaultReader(this)===!1?Promise.reject(defaultReaderBrandCheckException("read")):void 0===this._ownerReadableStream?Promise.reject(readerLockException("read from")):ReadableStreamDefaultReaderRead(this)}},{key:"releaseLock",value:function(){if(IsReadableStreamDefaultReader(this)===!1)throw defaultReaderBrandCheckException("releaseLock");if(void 0!==this._ownerReadableStream){if(this._readRequests.length>0)throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");ReadableStreamReaderGenericRelease(this)}}},{key:"closed",get:function(){return IsReadableStreamDefaultReader(this)===!1?Promise.reject(defaultReaderBrandCheckException("closed")):this._closedPromise}}]),e}(),ReadableStreamBYOBReader=function(){function e(r){if(_classCallCheck(this,e),!IsReadableStream(r))throw new TypeError("ReadableStreamBYOBReader can only be constructed with a ReadableStream instance given a byte source");if(IsReadableStreamLocked(r))throw new TypeError("This stream has already been locked for exclusive reading by another reader");ReadableStreamReaderGenericInitialize(this,r),this._readIntoRequests=[]}return _createClass(e,[{key:"cancel",value:function(e){return IsReadableStreamBYOBReader(this)?void 0===this._ownerReadableStream?Promise.reject(readerLockException("cancel")):ReadableStreamReaderGenericCancel(this,e):Promise.reject(byobReaderBrandCheckException("cancel"))}},{key:"read",value:function(e){return IsReadableStreamBYOBReader(this)?void 0===this._ownerReadableStream?Promise.reject(readerLockException("read from")):ArrayBuffer.isView(e)?0===e.byteLength?Promise.reject(new TypeError("view must have non-zero byteLength")):ReadableStreamBYOBReaderRead(this,e):Promise.reject(new TypeError("view must be an array buffer view")):Promise.reject(byobReaderBrandCheckException("read"))}},{key:"releaseLock",value:function(){if(!IsReadableStreamBYOBReader(this))throw byobReaderBrandCheckException("releaseLock");if(void 0!==this._ownerReadableStream){if(this._readIntoRequests.length>0)throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");ReadableStreamReaderGenericRelease(this)}}},{key:"closed",get:function(){return IsReadableStreamBYOBReader(this)?this._closedPromise:Promise.reject(byobReaderBrandCheckException("closed"))}}]),e}(),ReadableStreamDefaultController=function(){function e(r,t,a,l){if(_classCallCheck(this,e),IsReadableStream(r)===!1)throw new TypeError("ReadableStreamDefaultController can only be constructed with a ReadableStream instance");if(void 0!==r._readableStreamController)throw new TypeError("ReadableStreamDefaultController instances can only be created by the ReadableStream constructor");this._controlledReadableStream=r,this._underlyingSource=t,this._queue=[],this._started=!1,this._closeRequested=!1,this._pullAgain=!1,this._pulling=!1;var o=ValidateAndNormalizeQueuingStrategy(a,l);this._strategySize=o.size,this._strategyHWM=o.highWaterMark;var n=this,i=InvokeOrNoop(t,"start",[this]);Promise.resolve(i).then(function(){n._started=!0,ReadableStreamDefaultControllerCallPullIfNeeded(n)},function(e){ReadableStreamDefaultControllerErrorIfNeeded(n,e)}).catch(rethrowAssertionErrorRejection)}return _createClass(e,[{key:"close",value:function(){if(IsReadableStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("close");if(this._closeRequested===!0)throw new TypeError("The stream has already been closed; do not close it again!");var e=this._controlledReadableStream._state;if("readable"!==e)throw new TypeError("The stream (in "+e+" state) is not in the readable state and cannot be closed");ReadableStreamDefaultControllerClose(this)}},{key:"enqueue",value:function(e){if(IsReadableStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("enqueue");if(this._closeRequested===!0)throw new TypeError("stream is closed or draining");var r=this._controlledReadableStream._state;if("readable"!==r)throw new TypeError("The stream (in "+r+" state) is not in the readable state and cannot be enqueued to");return ReadableStreamDefaultControllerEnqueue(this,e)}},{key:"error",value:function(e){if(IsReadableStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("error");var r=this._controlledReadableStream;if("readable"!==r._state)throw new TypeError("The stream is "+r._state+" and so cannot be errored");ReadableStreamDefaultControllerError(this,e)}},{key:InternalCancel,value:function(e){return this._queue=[],PromiseInvokeOrNoop(this._underlyingSource,"cancel",[e])}},{key:InternalPull,value:function(){var e=this._controlledReadableStream;if(this._queue.length>0){var r=DequeueValue(this._queue);return this._closeRequested===!0&&0===this._queue.length?ReadableStreamClose(e):ReadableStreamDefaultControllerCallPullIfNeeded(this),Promise.resolve(CreateIterResultObject(r,!1))}var t=ReadableStreamAddReadRequest(e);return ReadableStreamDefaultControllerCallPullIfNeeded(this),t}},{key:"desiredSize",get:function(){if(IsReadableStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("desiredSize");return ReadableStreamDefaultControllerGetDesiredSize(this)}}]),e}(),ReadableStreamBYOBRequest=function(){function e(r,t){_classCallCheck(this,e),this._associatedReadableByteStreamController=r,this._view=t}return _createClass(e,[{key:"respond",value:function(e){if(IsReadableStreamBYOBRequest(this)===!1)throw byobRequestBrandCheckException("respond");if(void 0===this._associatedReadableByteStreamController)throw new TypeError("This BYOB request has been invalidated");ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController,e)}},{key:"respondWithNewView",value:function(e){if(IsReadableStreamBYOBRequest(this)===!1)throw byobRequestBrandCheckException("respond");if(void 0===this._associatedReadableByteStreamController)throw new TypeError("This BYOB request has been invalidated");if(!ArrayBuffer.isView(e))throw new TypeError("You can only respond with array buffer views");ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController,e)}},{key:"view",get:function(){return this._view}}]),e}(),ReadableByteStreamController=function(){function e(r,t,a){if(_classCallCheck(this,e),IsReadableStream(r)===!1)throw new TypeError("ReadableByteStreamController can only be constructed with a ReadableStream instance given a byte source");if(void 0!==r._readableStreamController)throw new TypeError("ReadableByteStreamController instances can only be created by the ReadableStream constructor given a byte source");
this._controlledReadableStream=r,this._underlyingByteSource=t,this._pullAgain=!1,this._pulling=!1,ReadableByteStreamControllerClearPendingPullIntos(this),this._queue=[],this._totalQueuedBytes=0,this._closeRequested=!1,this._started=!1,this._strategyHWM=ValidateAndNormalizeHighWaterMark(a);var l=t.autoAllocateChunkSize;if(void 0!==l&&(Number.isInteger(l)===!1||l<=0))throw new RangeError("autoAllocateChunkSize must be a positive integer");this._autoAllocateChunkSize=l,this._pendingPullIntos=[];var o=this,n=InvokeOrNoop(t,"start",[this]);Promise.resolve(n).then(function(){o._started=!0,ReadableByteStreamControllerCallPullIfNeeded(o)},function(e){"readable"===r._state&&ReadableByteStreamControllerError(o,e)}).catch(rethrowAssertionErrorRejection)}return _createClass(e,[{key:"close",value:function(){if(IsReadableByteStreamController(this)===!1)throw byteStreamControllerBrandCheckException("close");if(this._closeRequested===!0)throw new TypeError("The stream has already been closed; do not close it again!");var e=this._controlledReadableStream._state;if("readable"!==e)throw new TypeError("The stream (in "+e+" state) is not in the readable state and cannot be closed");ReadableByteStreamControllerClose(this)}},{key:"enqueue",value:function(e){if(IsReadableByteStreamController(this)===!1)throw byteStreamControllerBrandCheckException("enqueue");if(this._closeRequested===!0)throw new TypeError("stream is closed or draining");var r=this._controlledReadableStream._state;if("readable"!==r)throw new TypeError("The stream (in "+r+" state) is not in the readable state and cannot be enqueued to");if(!ArrayBuffer.isView(e))throw new TypeError("You can only enqueue array buffer views when using a ReadableByteStreamController");ReadableByteStreamControllerEnqueue(this,e)}},{key:"error",value:function(e){if(IsReadableByteStreamController(this)===!1)throw byteStreamControllerBrandCheckException("error");var r=this._controlledReadableStream;if("readable"!==r._state)throw new TypeError("The stream is "+r._state+" and so cannot be errored");ReadableByteStreamControllerError(this,e)}},{key:InternalCancel,value:function(e){if(this._pendingPullIntos.length>0){var r=this._pendingPullIntos[0];r.bytesFilled=0}return this._queue=[],this._totalQueuedBytes=0,PromiseInvokeOrNoop(this._underlyingByteSource,"cancel",[e])}},{key:InternalPull,value:function(){var e=this._controlledReadableStream;if(0===ReadableStreamGetNumReadRequests(e)){if(this._totalQueuedBytes>0){var r=this._queue.shift();this._totalQueuedBytes-=r.byteLength,ReadableByteStreamControllerHandleQueueDrain(this);var t=void 0;try{t=new Uint8Array(r.buffer,r.byteOffset,r.byteLength)}catch(e){return Promise.reject(e)}return Promise.resolve(CreateIterResultObject(t,!1))}var a=this._autoAllocateChunkSize;if(void 0!==a){var l=void 0;try{l=new ArrayBuffer(a)}catch(e){return Promise.reject(e)}var o={buffer:l,byteOffset:0,byteLength:a,bytesFilled:0,elementSize:1,ctor:Uint8Array,readerType:"default"};this._pendingPullIntos.push(o)}}var n=ReadableStreamAddReadRequest(e);return ReadableByteStreamControllerCallPullIfNeeded(this),n}},{key:"byobRequest",get:function(){if(IsReadableByteStreamController(this)===!1)throw byteStreamControllerBrandCheckException("byobRequest");if(void 0===this._byobRequest&&this._pendingPullIntos.length>0){var e=this._pendingPullIntos[0],r=new Uint8Array(e.buffer,e.byteOffset+e.bytesFilled,e.byteLength-e.bytesFilled);this._byobRequest=new ReadableStreamBYOBRequest(this,r)}return this._byobRequest}},{key:"desiredSize",get:function(){if(IsReadableByteStreamController(this)===!1)throw byteStreamControllerBrandCheckException("desiredSize");return ReadableByteStreamControllerGetDesiredSize(this)}}]),e}();

},{"./helpers.js":5,"./queue-with-sizes.js":6,"./utils.js":2,"./writable-stream.js":9}],8:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}function TransformStreamCloseReadable(r){if(r._errored===!0)throw new TypeError("TransformStream is already errored");if(r._readableClosed===!0)throw new TypeError("Readable side is already closed");TransformStreamCloseReadableInternal(r)}function TransformStreamEnqueueToReadable(r,e){if(r._errored===!0)throw new TypeError("TransformStream is already errored");if(r._readableClosed===!0)throw new TypeError("Readable side is already closed");var a=r._readableController;try{ReadableStreamDefaultControllerEnqueue(a,e)}catch(e){throw r._readableClosed=!0,TransformStreamErrorIfNeeded(r,e),r._storedError}var t=ReadableStreamDefaultControllerGetDesiredSize(a),o=t<=0;o===!0&&r._backpressure===!1&&TransformStreamSetBackpressure(r,!0)}function TransformStreamError(r,e){if(r._errored===!0)throw new TypeError("TransformStream is already errored");TransformStreamErrorInternal(r,e)}function TransformStreamCloseReadableInternal(r){try{ReadableStreamDefaultControllerClose(r._readableController)}catch(r){}r._readableClosed=!0}function TransformStreamErrorIfNeeded(r,e){r._errored===!1&&TransformStreamErrorInternal(r,e)}function TransformStreamErrorInternal(r,e){r._errored=!0,r._storedError=e,r._writableDone===!1&&WritableStreamDefaultControllerError(r._writableController,e),r._readableClosed===!1&&ReadableStreamDefaultControllerError(r._readableController,e)}function TransformStreamReadableReadyPromise(r){return r._backpressure===!1?Promise.resolve():r._backpressureChangePromise}function TransformStreamSetBackpressure(r,e){void 0!==r._backpressureChangePromise&&r._backpressureChangePromise_resolve(e),r._backpressureChangePromise=new Promise(function(e){r._backpressureChangePromise_resolve=e}),r._backpressureChangePromise.then(function(r){}),r._backpressure=e}function TransformStreamDefaultTransform(r,e){var a=e._controlledTransformStream;return TransformStreamEnqueueToReadable(a,r),Promise.resolve()}function TransformStreamTransform(r,e){r._transforming=!0;var a=r._transformer,t=r._transformStreamController,o=PromiseInvokeOrPerformFallback(a,"transform",[e,t],TransformStreamDefaultTransform,[e,t]);return o.then(function(){return r._transforming=!1,TransformStreamReadableReadyPromise(r)},function(e){return TransformStreamErrorIfNeeded(r,e),Promise.reject(e)})}function IsTransformStreamDefaultController(r){return!!typeIsObject(r)&&!!Object.prototype.hasOwnProperty.call(r,"_controlledTransformStream")}function IsTransformStream(r){return!!typeIsObject(r)&&!!Object.prototype.hasOwnProperty.call(r,"_transformStreamController")}function defaultControllerBrandCheckException(r){return new TypeError("TransformStreamDefaultController.prototype."+r+" can only be used on a TransformStreamDefaultController")}function streamBrandCheckException(r){return new TypeError("TransformStream.prototype."+r+" can only be used on a TransformStream")}var _createClass=function(){function r(r,e){for(var a=0;a<e.length;a++){var t=e[a];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(r,t.key,t)}}return function(e,a,t){return a&&r(e.prototype,a),t&&r(e,t),e}}(),_require=_dereq_("./helpers.js"),InvokeOrNoop=_require.InvokeOrNoop,PromiseInvokeOrPerformFallback=_require.PromiseInvokeOrPerformFallback,PromiseInvokeOrNoop=_require.PromiseInvokeOrNoop,typeIsObject=_require.typeIsObject,_require2=_dereq_("./readable-stream.js"),ReadableStream=_require2.ReadableStream,ReadableStreamDefaultControllerClose=_require2.ReadableStreamDefaultControllerClose,ReadableStreamDefaultControllerEnqueue=_require2.ReadableStreamDefaultControllerEnqueue,ReadableStreamDefaultControllerError=_require2.ReadableStreamDefaultControllerError,ReadableStreamDefaultControllerGetDesiredSize=_require2.ReadableStreamDefaultControllerGetDesiredSize,_require3=_dereq_("./writable-stream.js"),WritableStream=_require3.WritableStream,WritableStreamDefaultControllerError=_require3.WritableStreamDefaultControllerError,TransformStreamSink=function(){function r(e,a){_classCallCheck(this,r),this._transformStream=e,this._startPromise=a}return _createClass(r,[{key:"start",value:function(r){var e=this._transformStream;return e._writableController=r,this._startPromise.then(function(){return TransformStreamReadableReadyPromise(e)})}},{key:"write",value:function(r){var e=this._transformStream;return TransformStreamTransform(e,r)}},{key:"abort",value:function(){var r=this._transformStream;r._writableDone=!0,TransformStreamErrorInternal(r,new TypeError("Writable side aborted"))}},{key:"close",value:function(){var r=this._transformStream;r._writableDone=!0;var e=PromiseInvokeOrNoop(r._transformer,"flush",[r._transformStreamController]);return e.then(function(){return r._errored===!0?Promise.reject(r._storedError):(r._readableClosed===!1&&TransformStreamCloseReadableInternal(r),Promise.resolve())}).catch(function(e){return TransformStreamErrorIfNeeded(r,e),Promise.reject(r._storedError)})}}]),r}(),TransformStreamSource=function(){function r(e,a){_classCallCheck(this,r),this._transformStream=e,this._startPromise=a}return _createClass(r,[{key:"start",value:function(r){var e=this._transformStream;return e._readableController=r,this._startPromise.then(function(){return e._backpressure===!0?Promise.resolve():e._backpressureChangePromise})}},{key:"pull",value:function(){var r=this._transformStream;return TransformStreamSetBackpressure(r,!1),r._backpressureChangePromise}},{key:"cancel",value:function(){var r=this._transformStream;r._readableClosed=!0,TransformStreamErrorInternal(r,new TypeError("Readable side canceled"))}}]),r}(),TransformStreamDefaultController=function(){function r(e){if(_classCallCheck(this,r),IsTransformStream(e)===!1)throw new TypeError("TransformStreamDefaultController can only be constructed with a TransformStream instance");if(void 0!==e._transformStreamController)throw new TypeError("TransformStreamDefaultController instances can only be created by the TransformStream constructor");this._controlledTransformStream=e}return _createClass(r,[{key:"enqueue",value:function(r){if(IsTransformStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("enqueue");TransformStreamEnqueueToReadable(this._controlledTransformStream,r)}},{key:"close",value:function(){if(IsTransformStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("close");TransformStreamCloseReadable(this._controlledTransformStream)}},{key:"error",value:function(r){if(IsTransformStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("error");TransformStreamError(this._controlledTransformStream,r)}},{key:"desiredSize",get:function(){if(IsTransformStreamDefaultController(this)===!1)throw defaultControllerBrandCheckException("desiredSize");var r=this._controlledTransformStream,e=r._readableController;return ReadableStreamDefaultControllerGetDesiredSize(e)}}]),r}(),TransformStream=function(){function r(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};_classCallCheck(this,r),this._transformer=e;var a=e.readableStrategy,t=e.writableStrategy;this._transforming=!1,this._errored=!1,this._storedError=void 0,this._writableController=void 0,this._readableController=void 0,this._transformStreamController=void 0,this._writableDone=!1,this._readableClosed=!1,this._backpressure=void 0,this._backpressureChangePromise=void 0,this._backpressureChangePromise_resolve=void 0,this._transformStreamController=new TransformStreamDefaultController(this);var o=void 0,n=new Promise(function(r){o=r}),s=new TransformStreamSource(this,n);this._readable=new ReadableStream(s,a);var l=new TransformStreamSink(this,n);this._writable=new WritableStream(l,t);var i=ReadableStreamDefaultControllerGetDesiredSize(this._readableController);TransformStreamSetBackpressure(this,i<=0);var m=this,f=InvokeOrNoop(e,"start",[m._transformStreamController]);o(f),n.catch(function(r){m._errored===!1&&(m._errored=!0,m._storedError=r)})}return _createClass(r,[{key:"readable",get:function(){if(IsTransformStream(this)===!1)throw streamBrandCheckException("readable");return this._readable}},{key:"writable",get:function(){if(IsTransformStream(this)===!1)throw streamBrandCheckException("writable");return this._writable}}]),r}();module.exports={TransformStream:TransformStream};

},{"./helpers.js":5,"./readable-stream.js":7,"./writable-stream.js":9}],9:[function(_dereq_,module,exports){
"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function AcquireWritableStreamDefaultWriter(e){return new WritableStreamDefaultWriter(e)}function IsWritableStream(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_writableStreamController")}function IsWritableStreamLocked(e){return void 0!==e._writer}function WritableStreamAbort(e,r){var t=e._state;if("closed"===t)return Promise.resolve(void 0);if("errored"===t)return Promise.reject(e._storedError);var i=new TypeError("Aborted");WritableStreamError(e,i);var o=e._writableStreamController;if(o._writing===!0||o._inClose===!0){var a=new Promise(function(r,t){var i={_resolve:r,_reject:t};e._pendingAbortRequest=i});return o._writing===!0?a.then(function(){return WritableStreamDefaultControllerAbort(e._writableStreamController,r)}):a}return WritableStreamDefaultControllerAbort(e._writableStreamController,r)}function WritableStreamAddWriteRequest(e){var r=new Promise(function(r,t){var i={_resolve:r,_reject:t};e._writeRequests.push(i)});return r}function WritableStreamError(e,r){var t=e._state;e._state="errored",e._storedError=r;var i=e._writableStreamController;(void 0===i||i._writing===!1&&i._inClose===!1)&&WritableStreamRejectPromisesInReactionToError(e);var o=e._writer;void 0!==o&&("writable"===t&&WritableStreamDefaultControllerGetBackpressure(e._writableStreamController)===!0?defaultWriterReadyPromiseReject(o,r):defaultWriterReadyPromiseResetToRejected(o,r),o._readyPromise.catch(function(){}))}function WritableStreamFinishClose(e){"closing"===e._state?(defaultWriterClosedPromiseResolve(e._writer),e._state="closed"):(defaultWriterClosedPromiseReject(e._writer,e._storedError),e._writer._closedPromise.catch(function(){})),void 0!==e._pendingAbortRequest&&(e._pendingAbortRequest._resolve(),e._pendingAbortRequest=void 0)}function WritableStreamRejectPromisesInReactionToError(e){var r=e._storedError,t=!0,i=!1,o=void 0;try{for(var a,l=e._writeRequests[Symbol.iterator]();!(t=(a=l.next()).done);t=!0){var n=a.value;n._reject(r)}}catch(e){i=!0,o=e}finally{try{!t&&l.return&&l.return()}finally{if(i)throw o}}e._writeRequests=[],void 0!==e._pendingCloseRequest&&(e._pendingCloseRequest._reject(r),e._pendingCloseRequest=void 0);var s=e._writer;void 0!==s&&(defaultWriterClosedPromiseReject(s,r),s._closedPromise.catch(function(){}))}function WritableStreamUpdateBackpressure(e,r){var t=e._writer;void 0!==t&&(r===!0?defaultWriterReadyPromiseReset(t):defaultWriterReadyPromiseResolve(t))}function IsWritableStreamDefaultWriter(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_ownerWritableStream")}function WritableStreamDefaultWriterAbort(e,r){var t=e._ownerWritableStream;return WritableStreamAbort(t,r)}function WritableStreamDefaultWriterClose(e){var r=e._ownerWritableStream,t=r._state;if("closed"===t||"errored"===t)return Promise.reject(new TypeError("The stream (in "+t+" state) is not in the writable state and cannot be closed"));var i=new Promise(function(e,t){var i={_resolve:e,_reject:t};r._pendingCloseRequest=i});return WritableStreamDefaultControllerGetBackpressure(r._writableStreamController)===!0&&defaultWriterReadyPromiseResolve(e),r._state="closing",WritableStreamDefaultControllerClose(r._writableStreamController),i}function WritableStreamDefaultWriterCloseWithErrorPropagation(e){var r=e._ownerWritableStream,t=r._state;return"closing"===t||"closed"===t?Promise.resolve():"errored"===t?Promise.reject(r._storedError):WritableStreamDefaultWriterClose(e)}function WritableStreamDefaultWriterGetDesiredSize(e){var r=e._ownerWritableStream,t=r._state;return"errored"===t?null:"closed"===t?0:WritableStreamDefaultControllerGetDesiredSize(r._writableStreamController)}function WritableStreamDefaultWriterRelease(e){var r=e._ownerWritableStream,t=new TypeError("Writer was released and can no longer be used to monitor the stream's closedness"),i=r._state;"writable"===i||"closing"===i||void 0!==r._pendingAbortRequest?defaultWriterClosedPromiseReject(e,t):defaultWriterClosedPromiseResetToRejected(e,t),e._closedPromise.catch(function(){}),"writable"===i&&WritableStreamDefaultControllerGetBackpressure(r._writableStreamController)===!0?defaultWriterReadyPromiseReject(e,t):defaultWriterReadyPromiseResetToRejected(e,t),e._readyPromise.catch(function(){}),r._writer=void 0,e._ownerWritableStream=void 0}function WritableStreamDefaultWriterWrite(e,r){var t=e._ownerWritableStream,i=t._state;if("closed"===i||"errored"===i)return Promise.reject(new TypeError("The stream (in "+i+" state) is not in the writable state and cannot be written to"));var o=WritableStreamAddWriteRequest(t);return WritableStreamDefaultControllerWrite(t._writableStreamController,r),o}function WritableStreamDefaultControllerAbort(e,r){e._queue=[];var t=PromiseInvokeOrFallbackOrNoop(e._underlyingSink,"abort",[r],"close",[e]);return t.then(function(){})}function WritableStreamDefaultControllerClose(e){EnqueueValueWithSize(e._queue,"close",0),WritableStreamDefaultControllerAdvanceQueueIfNeeded(e)}function WritableStreamDefaultControllerGetDesiredSize(e){var r=GetTotalQueueSize(e._queue);return e._strategyHWM-r}function WritableStreamDefaultControllerWrite(e,r){var t=e._controlledWritableStream,i=1;if(void 0!==e._strategySize)try{i=e._strategySize(r)}catch(r){return void WritableStreamDefaultControllerErrorIfNeeded(e,r)}var o={chunk:r},a=WritableStreamDefaultControllerGetBackpressure(e);try{EnqueueValueWithSize(e._queue,o,i)}catch(r){return void WritableStreamDefaultControllerErrorIfNeeded(e,r)}if("writable"===t._state){var l=WritableStreamDefaultControllerGetBackpressure(e);a!==l&&WritableStreamUpdateBackpressure(t,l)}WritableStreamDefaultControllerAdvanceQueueIfNeeded(e)}function IsWritableStreamDefaultController(e){return!!typeIsObject(e)&&!!Object.prototype.hasOwnProperty.call(e,"_underlyingSink")}function WritableStreamDefaultControllerAdvanceQueueIfNeeded(e){if("closed"!==e._controlledWritableStream._state&&"errored"!==e._controlledWritableStream._state&&e._started!==!1&&e._writing!==!0&&0!==e._queue.length){var r=PeekQueueValue(e._queue);"close"===r?WritableStreamDefaultControllerProcessClose(e):WritableStreamDefaultControllerProcessWrite(e,r.chunk)}}function WritableStreamDefaultControllerErrorIfNeeded(e,r){"writable"!==e._controlledWritableStream._state&&"closing"!==e._controlledWritableStream._state||WritableStreamDefaultControllerError(e,r)}function WritableStreamDefaultControllerProcessClose(e){var r=e._controlledWritableStream;DequeueValue(e._queue),e._inClose=!0;var t=PromiseInvokeOrNoop(e._underlyingSink,"close",[e]);t.then(function(){e._inClose=!1,"closing"!==r._state&&"errored"!==r._state||(r._pendingCloseRequest._resolve(void 0),r._pendingCloseRequest=void 0,WritableStreamFinishClose(r))},function(t){e._inClose=!1,r._pendingCloseRequest._reject(t),r._pendingCloseRequest=void 0,void 0!==r._pendingAbortRequest&&(r._pendingAbortRequest._reject(t),r._pendingAbortRequest=void 0),WritableStreamDefaultControllerErrorIfNeeded(e,t)}).catch(rethrowAssertionErrorRejection)}function WritableStreamDefaultControllerProcessWrite(e,r){e._writing=!0;var t=e._controlledWritableStream;t._pendingWriteRequest=t._writeRequests.shift();var i=PromiseInvokeOrNoop(e._underlyingSink,"write",[r,e]);i.then(function(){var r=t._state;if(e._writing=!1,t._pendingWriteRequest._resolve(void 0),t._pendingWriteRequest=void 0,"errored"===r)return WritableStreamRejectPromisesInReactionToError(t),void(void 0!==t._pendingAbortRequest&&(t._pendingAbortRequest._resolve(),t._pendingAbortRequest=void 0));var i=WritableStreamDefaultControllerGetBackpressure(e);if(DequeueValue(e._queue),"closing"!==r){var o=WritableStreamDefaultControllerGetBackpressure(e);i!==o&&WritableStreamUpdateBackpressure(e._controlledWritableStream,o)}WritableStreamDefaultControllerAdvanceQueueIfNeeded(e)},function(r){e._writing=!1,t._pendingWriteRequest._reject(r),t._pendingWriteRequest=void 0,"errored"===t._state&&(t._storedError=r,WritableStreamRejectPromisesInReactionToError(t)),void 0!==t._pendingAbortRequest&&(t._pendingAbortRequest._reject(r),t._pendingAbortRequest=void 0),WritableStreamDefaultControllerErrorIfNeeded(e,r)}).catch(rethrowAssertionErrorRejection)}function WritableStreamDefaultControllerGetBackpressure(e){var r=WritableStreamDefaultControllerGetDesiredSize(e);return r<=0}function WritableStreamDefaultControllerError(e,r){var t=e._controlledWritableStream;WritableStreamError(t,r),e._queue=[]}function streamBrandCheckException(e){return new TypeError("WritableStream.prototype."+e+" can only be used on a WritableStream")}function defaultWriterBrandCheckException(e){return new TypeError("WritableStreamDefaultWriter.prototype."+e+" can only be used on a WritableStreamDefaultWriter")}function defaultWriterLockException(e){return new TypeError("Cannot "+e+" a stream using a released writer")}function defaultWriterClosedPromiseInitialize(e){e._closedPromise=new Promise(function(r,t){e._closedPromise_resolve=r,e._closedPromise_reject=t})}function defaultWriterClosedPromiseInitializeAsRejected(e,r){e._closedPromise=Promise.reject(r),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultWriterClosedPromiseInitializeAsResolved(e){e._closedPromise=Promise.resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultWriterClosedPromiseReject(e,r){e._closedPromise_reject(r),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultWriterClosedPromiseResetToRejected(e,r){e._closedPromise=Promise.reject(r)}function defaultWriterClosedPromiseResolve(e){e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0}function defaultWriterReadyPromiseInitialize(e){e._readyPromise=new Promise(function(r,t){e._readyPromise_resolve=r,e._readyPromise_reject=t})}function defaultWriterReadyPromiseInitializeAsResolved(e){e._readyPromise=Promise.resolve(void 0),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0}function defaultWriterReadyPromiseReject(e,r){e._readyPromise_reject(r),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0}function defaultWriterReadyPromiseReset(e){e._readyPromise=new Promise(function(r,t){e._readyPromise_resolve=r,e._readyPromise_reject=t})}function defaultWriterReadyPromiseResetToRejected(e,r){e._readyPromise=Promise.reject(r)}function defaultWriterReadyPromiseResolve(e){e._readyPromise_resolve(void 0),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0}var _createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var i=r[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(r,t,i){return t&&e(r.prototype,t),i&&e(r,i),r}}(),_require=_dereq_("./helpers.js"),InvokeOrNoop=_require.InvokeOrNoop,PromiseInvokeOrNoop=_require.PromiseInvokeOrNoop,PromiseInvokeOrFallbackOrNoop=_require.PromiseInvokeOrFallbackOrNoop,ValidateAndNormalizeQueuingStrategy=_require.ValidateAndNormalizeQueuingStrategy,typeIsObject=_require.typeIsObject,_require2=_dereq_("./utils.js"),rethrowAssertionErrorRejection=_require2.rethrowAssertionErrorRejection,_require3=_dereq_("./queue-with-sizes.js"),DequeueValue=_require3.DequeueValue,EnqueueValueWithSize=_require3.EnqueueValueWithSize,GetTotalQueueSize=_require3.GetTotalQueueSize,PeekQueueValue=_require3.PeekQueueValue,WritableStream=function(){function e(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=t.size,o=t.highWaterMark,a=void 0===o?1:o;_classCallCheck(this,e),this._state="writable",this._storedError=void 0,this._writer=void 0,this._writableStreamController=void 0,this._writeRequests=[],this._pendingWriteRequest=void 0,this._pendingCloseRequest=void 0,this._pendingAbortRequest=void 0;var l=r.type;if(void 0!==l)throw new RangeError("Invalid type is specified");this._writableStreamController=new WritableStreamDefaultController(this,r,i,a)}return _createClass(e,[{key:"abort",value:function(e){return IsWritableStream(this)===!1?Promise.reject(streamBrandCheckException("abort")):IsWritableStreamLocked(this)===!0?Promise.reject(new TypeError("Cannot abort a stream that already has a writer")):WritableStreamAbort(this,e)}},{key:"getWriter",value:function(){if(IsWritableStream(this)===!1)throw streamBrandCheckException("getWriter");return AcquireWritableStreamDefaultWriter(this)}},{key:"locked",get:function(){if(IsWritableStream(this)===!1)throw streamBrandCheckException("locked");return IsWritableStreamLocked(this)}}]),e}();module.exports={AcquireWritableStreamDefaultWriter:AcquireWritableStreamDefaultWriter,IsWritableStream:IsWritableStream,IsWritableStreamLocked:IsWritableStreamLocked,WritableStream:WritableStream,WritableStreamAbort:WritableStreamAbort,WritableStreamDefaultControllerError:WritableStreamDefaultControllerError,WritableStreamDefaultWriterCloseWithErrorPropagation:WritableStreamDefaultWriterCloseWithErrorPropagation,WritableStreamDefaultWriterRelease:WritableStreamDefaultWriterRelease,WritableStreamDefaultWriterWrite:WritableStreamDefaultWriterWrite};var WritableStreamDefaultWriter=function(){function e(r){if(_classCallCheck(this,e),IsWritableStream(r)===!1)throw new TypeError("WritableStreamDefaultWriter can only be constructed with a WritableStream instance");if(IsWritableStreamLocked(r)===!0)throw new TypeError("This stream has already been locked for exclusive writing by another writer");this._ownerWritableStream=r,r._writer=this;var t=r._state;"writable"===t||"closing"===t?defaultWriterClosedPromiseInitialize(this):"closed"===t?defaultWriterClosedPromiseInitializeAsResolved(this):(defaultWriterClosedPromiseInitializeAsRejected(this,r._storedError),this._closedPromise.catch(function(){})),"writable"===t&&WritableStreamDefaultControllerGetBackpressure(r._writableStreamController)===!0?defaultWriterReadyPromiseInitialize(this):defaultWriterReadyPromiseInitializeAsResolved(this,void 0)}return _createClass(e,[{key:"abort",value:function(e){return IsWritableStreamDefaultWriter(this)===!1?Promise.reject(defaultWriterBrandCheckException("abort")):void 0===this._ownerWritableStream?Promise.reject(defaultWriterLockException("abort")):WritableStreamDefaultWriterAbort(this,e)}},{key:"close",value:function(){if(IsWritableStreamDefaultWriter(this)===!1)return Promise.reject(defaultWriterBrandCheckException("close"));var e=this._ownerWritableStream;return void 0===e?Promise.reject(defaultWriterLockException("close")):"closing"===e._state?Promise.reject(new TypeError("cannot close an already-closing stream")):WritableStreamDefaultWriterClose(this)}},{key:"releaseLock",value:function(){if(IsWritableStreamDefaultWriter(this)===!1)throw defaultWriterBrandCheckException("releaseLock");var e=this._ownerWritableStream;void 0!==e&&WritableStreamDefaultWriterRelease(this)}},{key:"write",value:function(e){if(IsWritableStreamDefaultWriter(this)===!1)return Promise.reject(defaultWriterBrandCheckException("write"));var r=this._ownerWritableStream;return void 0===r?Promise.reject(defaultWriterLockException("write to")):"closing"===r._state?Promise.reject(new TypeError("Cannot write to an already-closed stream")):WritableStreamDefaultWriterWrite(this,e)}},{key:"closed",get:function(){return IsWritableStreamDefaultWriter(this)===!1?Promise.reject(defaultWriterBrandCheckException("closed")):this._closedPromise}},{key:"desiredSize",get:function(){if(IsWritableStreamDefaultWriter(this)===!1)throw defaultWriterBrandCheckException("desiredSize");if(void 0===this._ownerWritableStream)throw defaultWriterLockException("desiredSize");return WritableStreamDefaultWriterGetDesiredSize(this)}},{key:"ready",get:function(){return IsWritableStreamDefaultWriter(this)===!1?Promise.reject(defaultWriterBrandCheckException("ready")):this._readyPromise}}]),e}(),WritableStreamDefaultController=function(){function e(r,t,i,o){if(_classCallCheck(this,e),IsWritableStream(r)===!1)throw new TypeError("WritableStreamDefaultController can only be constructed with a WritableStream instance");if(void 0!==r._writableStreamController)throw new TypeError("WritableStreamDefaultController instances can only be created by the WritableStream constructor");this._controlledWritableStream=r,this._underlyingSink=t,this._queue=[],this._started=!1,this._writing=!1,this._inClose=!1;var a=ValidateAndNormalizeQueuingStrategy(i,o);this._strategySize=a.size,this._strategyHWM=a.highWaterMark;var l=WritableStreamDefaultControllerGetBackpressure(this);l===!0&&WritableStreamUpdateBackpressure(r,l);var n=this,s=InvokeOrNoop(t,"start",[this]);Promise.resolve(s).then(function(){n._started=!0,WritableStreamDefaultControllerAdvanceQueueIfNeeded(n)},function(e){WritableStreamDefaultControllerErrorIfNeeded(n,e)}).catch(rethrowAssertionErrorRejection)}return _createClass(e,[{key:"error",value:function(e){if(IsWritableStreamDefaultController(this)===!1)throw new TypeError("WritableStreamDefaultController.prototype.error can only be used on a WritableStreamDefaultController");var r=this._controlledWritableStream._state;if("closed"===r||"errored"===r)throw new TypeError("The stream is "+r+" and so cannot be errored");WritableStreamDefaultControllerError(this,e)}}]),e}();

},{"./helpers.js":5,"./queue-with-sizes.js":6,"./utils.js":2}]},{},[1])(1)
});
//# sourceMappingURL=polyfill.min.js.map


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ../node_modules/fetch-readablestream/src/fetch.js
// thin wrapper around `fetch()` to ensure we only expose the properties provided by
// the XHR polyfil; / fetch-readablestream Response API.
function fetchRequest(url, options) {
  return fetch(url, options)
    .then(r => {
      return {
        body: r.body,
        headers: r.headers,
        ok: r.ok,
        status: r.status,
        statusText: r.statusText,
        url: r.url
      };
    });
}

// CONCATENATED MODULE: ../node_modules/fetch-readablestream/src/polyfill/Headers.js
// Headers is a partial polyfill for the HTML5 Headers class.
class Headers_Headers {
  constructor(h = {}) {
    this.h = {};
    if (h instanceof Headers_Headers) {
      h.forEach((value, key) => this.append(key, value));
    }
    Object.getOwnPropertyNames(h)
        .forEach(key => this.append(key, h[key]));
  }
  append(key, value) {
    key = key.toLowerCase();
    if (!Array.isArray(this.h[key])) {
      this.h[key] = [];
    }
    this.h[key].push(value);
  }
  set(key, value) {
    this.h[key.toLowerCase()] = [ value ];
  }
  has(key) {
    return Array.isArray(this.h[key.toLowerCase()]);
  }
  get(key) {
    key = key.toLowerCase();
    if (Array.isArray(this.h[key])) {
      return this.h[key][0];
    }
  }
  getAll(key) {
    return this.h[key.toLowerCase()].concat();
  }
  entries() {
    const items = [];
    this.forEach((value, key) => { items.push([key, value]) });
    return makeIterator(items);
  }

  // forEach is not part of the official spec.
  forEach(callback, thisArg) {
    Object.getOwnPropertyNames(this.h)
        .forEach(key => {
          this.h[key].forEach(value => callback.call(thisArg, value, key, this));
        }, this);
  }
}

function makeIterator(items) {
  return {
    next() {
      const value = items.shift();
      return {
        done: value === undefined,
        value: value
      }
    },
    [Symbol.iterator]() {
      return this;
    }
  };
}
// EXTERNAL MODULE: ../node_modules/original/index.js
var original = __webpack_require__(10);
var original_default = /*#__PURE__*/__webpack_require__.n(original);

// CONCATENATED MODULE: ../node_modules/fetch-readablestream/src/xhr.js



function makeXhrTransport({ responseType, responseParserFactory }) {
  return function xhrTransport(url, options) {
    const xhr = new XMLHttpRequest();
    const responseParser = responseParserFactory();

    let responseStreamController;
    let cancelled = false;

    const responseStream = new ReadableStream({
      start(c) {
        responseStreamController = c
      },
      cancel() {
        cancelled = true;
        xhr.abort()
      }
    });

    const { method = 'GET' } = options;

    xhr.open(method, url);
    xhr.responseType = responseType;
    xhr.withCredentials = (options.credentials === 'include' || (options.credentials === 'same-origin' && original_default.a.same(url, location.origin)));
    if (options.headers) {
      for (const pair of options.headers.entries()) {
        xhr.setRequestHeader(pair[0], pair[1]);
      }
    }

    return new Promise((resolve, reject) => {
      if (options.body && (method === 'GET' || method === 'HEAD')) {
        reject(new TypeError("Failed to execute 'fetchStream' on 'Window': Request with GET/HEAD method cannot have body"))
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.HEADERS_RECEIVED) {
          return resolve({
            body: responseStream,
            headers: parseResposneHeaders(xhr.getAllResponseHeaders()),
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            statusText: xhr.statusText,
            url: makeResponseUrl(xhr.responseURL, url)
          });
        }
      };

      xhr.onerror = function () {
        return reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      };

      xhr.onprogress = function () {
        if (!cancelled) {
          const bytes = responseParser(xhr.response);
          responseStreamController.enqueue(bytes);
        }
      };

      xhr.onload = function () {
        responseStreamController.close();
      };

      xhr.send(options.body);
    });
  }
}

function makeHeaders() {
  // Prefer the native method if provided by the browser.
  if (typeof Headers !== 'undefined') {
    return new Headers();
  }
  return new Headers_Headers();
}

function makeResponseUrl(responseUrl, requestUrl) {
  if (!responseUrl) {
    // best guess; note this will not correctly handle redirects.
    if (requestUrl.substring(0, 4) !== "http") {
      return location.origin + requestUrl;
    }
    return requestUrl;
  }
  return responseUrl;
}

function parseResposneHeaders(str) {
  const hdrs = makeHeaders();
  if (str) {
    const pairs = str.split('\u000d\u000a');
    for (let i = 0; i < pairs.length; i++) {
      const p = pairs[i];
      const index = p.indexOf('\u003a\u0020');
      if (index > 0) {
        const key = p.substring(0, index);
        const value = p.substring(index + 2);
        hdrs.append(key, value);
      }
    }
  }
  return hdrs;
}
// CONCATENATED MODULE: ../node_modules/fetch-readablestream/src/defaultTransportFactory.js



// selected is used to cache the detected transport.
let selected = null;

// defaultTransportFactory selects the most appropriate transport based on the
// capabilities of the current environment.
function defaultTransportFactory() {
  if (!selected) {
    selected = detectTransport();
  }
  return selected;
}

function detectTransport() {
  if (typeof Response !== 'undefined' && Response.prototype.hasOwnProperty("body")) {
    // fetch with ReadableStream support.
    return fetchRequest;
  }

  const mozChunked = 'moz-chunked-arraybuffer';
  if (supportsXhrResponseType(mozChunked)) {
    // Firefox, ArrayBuffer support.
    return makeXhrTransport({
      responseType: mozChunked,
      responseParserFactory: function () {
        return response => new Uint8Array(response);
      }
    });
  }

  // Bog-standard, expensive, text concatenation with byte encoding :(
  return makeXhrTransport({
    responseType: 'text',
    responseParserFactory: function () {
      const encoder = new TextEncoder();
      let offset = 0;
      return function (response) {
        const chunk = response.substr(offset);
        offset = response.length;
        return encoder.encode(chunk, { stream: true });
      }
    }
  });
}

function supportsXhrResponseType(type) {
  try {
    const tmpXhr = new XMLHttpRequest();
    tmpXhr.responseType = type;
    return tmpXhr.responseType === type;
  } catch (e) { /* IE throws on setting responseType to an unsupported value */ }
  return false;
}

// CONCATENATED MODULE: ../node_modules/fetch-readablestream/src/index.js
/* harmony export (immutable) */ __webpack_exports__["default"] = fetchStream;


function fetchStream(url, options = {}) {
  let transport = options.transport;
  if (!transport) {
    transport = fetchStream.transportFactory();
  }

  return transport(url, options);
}

// override this function to delegate to an alternative transport function selection
// strategy; useful when testing.
fetchStream.transportFactory = defaultTransportFactory;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(4);

/**
 * Transform an URL to a valid origin value.
 *
 * @param {String|Object} url URL to transform to it's origin.
 * @returns {String} The origin.
 * @api public
 */
function origin(url) {
  if ('string' === typeof url) url = parse(url);

  //
  // 6.2.  ASCII Serialization of an Origin
  // http://tools.ietf.org/html/rfc6454#section-6.2
  //
  if (!url.protocol || !url.hostname) return 'null';

  //
  // 4. Origin of a URI
  // http://tools.ietf.org/html/rfc6454#section-4
  //
  // States that url.scheme, host should be converted to lower case. This also
  // makes it easier to match origins as everything is just lower case.
  //
  return (url.protocol +'//'+ url.host).toLowerCase();
}

/**
 * Check if the origins are the same.
 *
 * @param {String} a URL or origin of a.
 * @param {String} b URL or origin of b.
 * @returns {Boolean}
 * @api public
 */
origin.same = function same(a, b) {
  return origin(a) === origin(b);
};

//
// Expose the origin
//
module.exports = origin;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as the a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 }
  , URL;

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @api public
 */
module.exports = function lolcation(loc) {
  loc = loc || global.location || {};
  URL = URL || __webpack_require__(4);

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new URL(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new URL(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) for (key in loc) {
    if (key in ignore) continue;
    finaldestination[key] = loc[key];
  }

  return finaldestination;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (;
    part = parser.exec(query);
    result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])
  );

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.adaptIframe = exports.replaceFlash = undefined;

var _regenerator = __webpack_require__(16);

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
                        targetNode.innerHTML = `<iframe id="innerFrame" src="${url}" frameborder="0" allowfullscreen="true" width="100%" height="100%"></iframe>`;
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

var _faker = __webpack_require__(5);

var _faker2 = _interopRequireDefault(_faker);

var _detector = __webpack_require__(3);

var _detector2 = _interopRequireDefault(_detector);

var _utils = __webpack_require__(19);

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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);


/***/ }),
/* 17 */
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

module.exports = __webpack_require__(18);

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 18 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 19 */
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
/* 20 */
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

var _fullscreen = __webpack_require__(21);

var _webFullscreen = __webpack_require__(22);

var _parsedData = __webpack_require__(23);

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
            _hooker2.default.hookConfig(function (exports) {
                exports.loadType = 'websocket'; // 'fetch'(default) or 'websocket'
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
/* 21 */
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
/* 22 */
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
/* 23 */
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