// ==UserScript==
// @name         iqiyi-player-switch
// @namespace    https://github.com/gooyie/userscript-iqiyi-player-switch
// @homepageURL  https://github.com/gooyie/userscript-iqiyi-player-switch
// @supportURL   https://github.com/gooyie/userscript-iqiyi-player-switch/issues
// @updateURL    https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/dist/iqiyi-player-switch.user.js
// @version      1.11.0
// @description  爱奇艺flash播放器与html5播放器随意切换，改善html5播放器播放体验。
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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var logDisabled_ = true;
var deprecationWarnings_ = true;

// Utility methods.
var utils = {
  disableLog: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return (bool) ? 'adapter.js logging disabled' :
        'adapter.js logging enabled';
  },

  /**
   * Disable or enable deprecation warnings
   * @param {!boolean} bool set to true to disable warnings.
   */
  disableWarnings: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    deprecationWarnings_ = !bool;
    return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
  },

  log: function() {
    if (typeof window === 'object') {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  },

  /**
   * Shows a deprecation warning suggesting the modern and spec-compatible API.
   */
  deprecated: function(oldMethod, newMethod) {
    if (!deprecationWarnings_) {
      return;
    }
    console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
        ' instead.');
  },

  /**
   * Extract browser version out of the provided user agent string.
   *
   * @param {!string} uastring userAgent string.
   * @param {!string} expr Regular expression used as match criteria.
   * @param {!number} pos position in the version string to be returned.
   * @return {!number} browser version.
   */
  extractVersion: function(uastring, expr, pos) {
    var match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  },

  /**
   * Browser detector.
   *
   * @return {object} result containing browser and version
   *     properties.
   */
  detectBrowser: function(window) {
    var navigator = window && window.navigator;

    // Returned result object.
    var result = {};
    result.browser = null;
    result.version = null;

    // Fail early if it's not a browser
    if (typeof window === 'undefined' || !window.navigator) {
      result.browser = 'Not a browser.';
      return result;
    }

    // Firefox.
    if (navigator.mozGetUserMedia) {
      result.browser = 'firefox';
      result.version = this.extractVersion(navigator.userAgent,
          /Firefox\/(\d+)\./, 1);
    } else if (navigator.webkitGetUserMedia) {
      // Chrome, Chromium, Webview, Opera, all use the chrome shim for now
      if (window.webkitRTCPeerConnection) {
        result.browser = 'chrome';
        result.version = this.extractVersion(navigator.userAgent,
          /Chrom(e|ium)\/(\d+)\./, 2);
      } else { // Safari (in an unpublished version) or unknown webkit-based.
        if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
          result.browser = 'safari';
          result.version = this.extractVersion(navigator.userAgent,
            /AppleWebKit\/(\d+)\./, 1);
        } else { // unknown webkit-based browser.
          result.browser = 'Unsupported webkit-based browser ' +
              'with GUM support but no WebRTC support.';
          return result;
        }
      }
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
      result.browser = 'edge';
      result.version = this.extractVersion(navigator.userAgent,
          /Edge\/(\d+).(\d+)$/, 2);
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        // Safari, with webkitGetUserMedia removed.
      result.browser = 'safari';
      result.version = this.extractVersion(navigator.userAgent,
          /AppleWebKit\/(\d+)\./, 1);
    } else { // Default fallthrough: not supported.
      result.browser = 'Not a supported browser.';
      return result;
    }

    return result;
  },

  // shimCreateObjectURL must be called before shimSourceObject to avoid loop.

  shimCreateObjectURL: function(window) {
    var URL = window && window.URL;

    if (!(typeof window === 'object' && window.HTMLMediaElement &&
          'srcObject' in window.HTMLMediaElement.prototype)) {
      // Only shim CreateObjectURL using srcObject if srcObject exists.
      return undefined;
    }

    var nativeCreateObjectURL = URL.createObjectURL.bind(URL);
    var nativeRevokeObjectURL = URL.revokeObjectURL.bind(URL);
    var streams = new Map(), newId = 0;

    URL.createObjectURL = function(stream) {
      if ('getTracks' in stream) {
        var url = 'polyblob:' + (++newId);
        streams.set(url, stream);
        utils.deprecated('URL.createObjectURL(stream)',
            'elem.srcObject = stream');
        return url;
      }
      return nativeCreateObjectURL(stream);
    };
    URL.revokeObjectURL = function(url) {
      nativeRevokeObjectURL(url);
      streams.delete(url);
    };

    var dsc = Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype,
                                              'src');
    Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
      get: function() {
        return dsc.get.apply(this);
      },
      set: function(url) {
        this.srcObject = streams.get(url) || null;
        return dsc.set.apply(this, [url]);
      }
    });

    var nativeSetAttribute = window.HTMLMediaElement.prototype.setAttribute;
    window.HTMLMediaElement.prototype.setAttribute = function() {
      if (arguments.length === 2 &&
          ('' + arguments[0]).toLowerCase() === 'src') {
        this.srcObject = streams.get(arguments[1]) || null;
      }
      return nativeSetAttribute.apply(this, arguments);
    };
  }
};

// Export.
module.exports = {
  log: utils.log,
  deprecated: utils.deprecated,
  disableLog: utils.disableLog,
  disableWarnings: utils.disableWarnings,
  extractVersion: utils.extractVersion,
  shimCreateObjectURL: utils.shimCreateObjectURL,
  detectBrowser: utils.detectBrowser.bind(utils)
};


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
            return this._tag;
        }
    }]);

    return Logger;
}();

exports.default = new Logger('[' + GM_info.script.name + ']');

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
    }, {
        key: 'isFullScreen',
        value: function isFullScreen() {
            return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
        }
    }]);

    return Detector;
}();

exports.default = Detector;

/***/ }),
/* 3 */
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
/* 4 */
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

exports.default = Cookies;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
                        _logger2.default.log('restored call');
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
                        var _step$value = _slicedToArray(_step.value, 2),
                            _pred = _step$value[0],
                            callbacks = _step$value[1];

                        if (!_pred.apply(_this, [exports])) continue;
                        callbacks.forEach(function (cb) {
                            return cb(exports, args);
                        });
                        callbacksMap.delete(_pred);
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
    }]);

    return Hooker;
}();

exports.default = Hooker;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var required = __webpack_require__(24)
  , lolcation = __webpack_require__(25)
  , qs = __webpack_require__(26)
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _cookies = __webpack_require__(4);

var _cookies2 = _interopRequireDefault(_cookies);

var _blueimpMd = __webpack_require__(28);

var _blueimpMd2 = _interopRequireDefault(_blueimpMd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    }, {
        key: '_calcSign',
        value: function _calcSign(authcookie) {
            var RESPONSE_KEY = '-0J1d9d^ESd)9jSsja';
            return (0, _blueimpMd2.default)(authcookie.substring(5, 39).split('').reverse().join('') + '<1<' + RESPONSE_KEY);
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
            _cookies2.default.set('P00001', 'faked_passport', { domain: '.iqiyi.com' });
            _logger2.default.log('faked passport cookie');
        }
    }]);

    return Faker;
}();

exports.default = Faker;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

__webpack_require__(9);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _cookies = __webpack_require__(4);

var _cookies2 = _interopRequireDefault(_cookies);

var _detector = __webpack_require__(2);

var _detector2 = _interopRequireDefault(_detector);

var _mocker = __webpack_require__(27);

var _mocker2 = _interopRequireDefault(_mocker);

var _patcher = __webpack_require__(29);

var _patcher2 = _interopRequireDefault(_patcher);

var _outsite = __webpack_require__(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLAYER_TYPE = {
    Html5VOD: 'h5_VOD',
    FlashVOD: 'flash_VOD'
};

function forceHtml5() {
    _logger2.default.log('setting player_forcedType cookie as ' + PLAYER_TYPE.Html5VOD);
    _cookies2.default.set('player_forcedType', PLAYER_TYPE.Html5VOD, { domain: '.iqiyi.com' });
}

function forceFlash() {
    _logger2.default.log('setting player_forcedType cookie as ' + PLAYER_TYPE.FlashVOD);
    _cookies2.default.set('player_forcedType', PLAYER_TYPE.FlashVOD, { domain: '.iqiyi.com' });
}

function clean() {
    _cookies2.default.remove('player_forcedType', { domain: '.iqiyi.com' });
    if (_cookies2.default.get('P00001') === 'faked_passport') _cookies2.default.remove('P00001', { domain: '.iqiyi.com' });
    _logger2.default.log('removed cookies.');
}

function switchTo(toType) {
    _logger2.default.log('switching to ' + toType + ' ...');

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
    _logger2.default.log('registered menu.');
}

//=============================================================================

registerMenu();

var currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD);
if (currType === PLAYER_TYPE.Html5VOD) {
    if (_detector2.default.isSupportHtml5()) {
        forceHtml5();
        _mocker2.default.mock();
        _patcher2.default.patchShortcuts();

        if (_detector2.default.isInnerFrame()) (0, _outsite.adaptIframe)();
        if (_detector2.default.isOutsite()) (0, _outsite.replaceFlash)();
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(10);

__webpack_require__(21);

var _src = __webpack_require__(22);

var _src2 = _interopRequireDefault(_src);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _detector = __webpack_require__(2);

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
            _logger2.default.log('fetching stream ' + url);
            return (0, _src2.default)(url, opts); // xhr with moz-chunked-arraybuffer
        } else {
            return fetch(url, opts);
        }
    };
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */



var adapterFactory = __webpack_require__(11);
module.exports = adapterFactory({window: global.window});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */



// Shimming starts here.
module.exports = function(dependencies, opts) {
  var window = dependencies && dependencies.window;

  var options = Object.assign({
    shimChrome: true,
    shimFirefox: true,
    shimEdge: true,
    shimSafari: true,
  }, opts);

  // Utils.
  var utils = __webpack_require__(0);
  var logging = utils.log;
  var browserDetails = utils.detectBrowser(window);

  // Export to the adapter global object visible in the browser.
  var adapter = {
    browserDetails: browserDetails,
    extractVersion: utils.extractVersion,
    disableLog: utils.disableLog,
    disableWarnings: utils.disableWarnings
  };

  // Uncomment the line below if you want logging to occur, including logging
  // for the switch statement below. Can also be turned on in the browser via
  // adapter.disableLog(false), but then logging from the switch statement below
  // will not appear.
  // require('./utils').disableLog(false);

  // Browser shims.
  var chromeShim = __webpack_require__(12) || null;
  var edgeShim = __webpack_require__(14) || null;
  var firefoxShim = __webpack_require__(18) || null;
  var safariShim = __webpack_require__(20) || null;

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'chrome':
      if (!chromeShim || !chromeShim.shimPeerConnection ||
          !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = chromeShim;

      chromeShim.shimGetUserMedia(window);
      chromeShim.shimMediaStream(window);
      utils.shimCreateObjectURL(window);
      chromeShim.shimSourceObject(window);
      chromeShim.shimPeerConnection(window);
      chromeShim.shimOnTrack(window);
      chromeShim.shimAddTrack(window);
      chromeShim.shimGetSendersWithDtmf(window);
      break;
    case 'firefox':
      if (!firefoxShim || !firefoxShim.shimPeerConnection ||
          !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = firefoxShim;

      firefoxShim.shimGetUserMedia(window);
      utils.shimCreateObjectURL(window);
      firefoxShim.shimSourceObject(window);
      firefoxShim.shimPeerConnection(window);
      firefoxShim.shimOnTrack(window);
      break;
    case 'edge':
      if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
        logging('MS edge shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming edge.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = edgeShim;

      edgeShim.shimGetUserMedia(window);
      utils.shimCreateObjectURL(window);
      edgeShim.shimPeerConnection(window);
      edgeShim.shimReplaceTrack(window);
      break;
    case 'safari':
      if (!safariShim || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = safariShim;
      // shim window.URL.createObjectURL Safari (technical preview)
      utils.shimCreateObjectURL(window);
      safariShim.shimRTCIceServerUrls(window);
      safariShim.shimCallbacksAPI(window);
      safariShim.shimLocalStreamsAPI(window);
      safariShim.shimRemoteStreamsAPI(window);
      safariShim.shimGetUserMedia(window);
      break;
    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

var utils = __webpack_require__(0);
var logging = utils.log;

var chromeShim = {
  shimMediaStream: function(window) {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
  },

  shimOnTrack: function(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          var self = this;
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', function(te) {
              var receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = self.getReceivers().find(function(r) {
                  return r.track.id === te.track.id;
                });
              } else {
                receiver = {track: te.track};
              }

              var event = new Event('track');
              event.track = te.track;
              event.receiver = receiver;
              event.streams = [e.stream];
              self.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(function(track) {
              var receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = self.getReceivers().find(function(r) {
                  return r.track.id === track.id;
                });
              } else {
                receiver = {track: track};
              }
              var event = new Event('track');
              event.track = track;
              event.receiver = receiver;
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        }
      });
    }
  },

  shimGetSendersWithDtmf: function(window) {
    if (typeof window === 'object' && window.RTCPeerConnection &&
        !('getSenders' in window.RTCPeerConnection.prototype) &&
        'createDTMFSender' in window.RTCPeerConnection.prototype) {
      var shimSenderWithDtmf = function(pc, track) {
        return {
          track: track,
          get dtmf() {
            if (this._dtmf === undefined) {
              if (track.kind === 'audio') {
                this._dtmf = pc.createDTMFSender(track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }
        };
      };

      // shim addTrack when getSenders is not available.
      if (!window.RTCPeerConnection.prototype.getSenders) {
        window.RTCPeerConnection.prototype.getSenders = function() {
          return this._senders || [];
        };
        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
          var pc = this;
          var sender = origAddTrack.apply(pc, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(pc, track);
            pc._senders.push(sender);
          }
          return sender;
        };
      }
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function(stream) {
        var pc = this;
        pc._senders = pc._senders || [];
        origAddStream.apply(pc, [stream]);
        stream.getTracks().forEach(function(track) {
          pc._senders.push(shimSenderWithDtmf(pc, track));
        });
      };

      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function(stream) {
        var pc = this;
        pc._senders = pc._senders || [];
        origRemoveStream.apply(pc, [(pc._streams[stream.id] || stream)]);

        stream.getTracks().forEach(function(track) {
          var sender = pc._senders.find(function(s) {
            return s.track === track;
          });
          if (sender) {
            pc._senders.splice(pc._senders.indexOf(sender), 1); // remove sender
          }
        });
      };
    } else if (typeof window === 'object' && window.RTCPeerConnection &&
               'getSenders' in window.RTCPeerConnection.prototype &&
               'createDTMFSender' in window.RTCPeerConnection.prototype &&
               window.RTCRtpSender &&
               !('dtmf' in window.RTCRtpSender.prototype)) {
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      window.RTCPeerConnection.prototype.getSenders = function() {
        var pc = this;
        var senders = origGetSenders.apply(pc, []);
        senders.forEach(function(sender) {
          sender._pc = pc;
        });
        return senders;
      };

      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get: function() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = this._pc.createDTMFSender(this.track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        },
      });
    }
  },

  shimSourceObject: function(window) {
    var URL = window && window.URL;

    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this._srcObject;
          },
          set: function(stream) {
            var self = this;
            // Use _srcObject as a private property for this shim
            this._srcObject = stream;
            if (this.src) {
              URL.revokeObjectURL(this.src);
            }

            if (!stream) {
              this.src = '';
              return undefined;
            }
            this.src = URL.createObjectURL(stream);
            // We need to recreate the blob url when a track is added or
            // removed. Doing it manually since we want to avoid a recursion.
            stream.addEventListener('addtrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
            stream.addEventListener('removetrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
          }
        });
      }
    }
  },

  shimAddTrack: function(window) {
    // shim addTrack (when getSenders is available)
    if (window.RTCPeerConnection.prototype.addTrack) {
      return;
    }

    // also shim pc.getLocalStreams when addTrack is shimmed
    // to return the original streams.
    var origGetLocalStreams = window.RTCPeerConnection.prototype
        .getLocalStreams;
    window.RTCPeerConnection.prototype.getLocalStreams = function() {
      var self = this;
      var nativeStreams = origGetLocalStreams.apply(this);
      self._reverseStreams = self._reverseStreams || {};
      return nativeStreams.map(function(stream) {
        return self._reverseStreams[stream.id];
      });
    };

    var origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function(stream) {
      var pc = this;
      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};

      // Add identity mapping for consistency with addTrack.
      // Unless this is being used with a stream from addTrack.
      if (!pc._reverseStreams[stream.id]) {
        pc._streams[stream.id] = stream;
        pc._reverseStreams[stream.id] = stream;
      }
      origAddStream.apply(pc, [stream]);
    };

    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      var pc = this;
      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};

      origRemoveStream.apply(pc, [(pc._streams[stream.id] || stream)]);
      delete pc._reverseStreams[(pc._streams[stream.id] ?
          pc._streams[stream.id].id : stream.id)];
      delete pc._streams[stream.id];
    };

    window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
      var pc = this;
      if (pc.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      var streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 ||
          !streams[0].getTracks().find(function(t) {
            return t === track;
          })) {
        // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException(
          'The adapter.js addTrack polyfill only supports a single ' +
          ' stream which is associated with the specified track.',
          'NotSupportedError');
      }

      var alreadyExists = pc.getSenders().find(function(s) {
        return s.track === track;
      });
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }

      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};
      var oldStream = pc._streams[stream.id];
      if (oldStream) {
        // this is using odd Chrome behaviour, use with caution:
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
        oldStream.addTrack(track);
        pc.dispatchEvent(new Event('negotiationneeded'));
      } else {
        var newStream = new window.MediaStream([track]);
        pc._streams[stream.id] = newStream;
        pc._reverseStreams[newStream.id] = stream;
        pc.addStream(newStream);
      }
      return pc.getSenders().find(function(s) {
        return s.track === track;
      });
    };
  },

  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        // Translate iceTransportPolicy to iceTransports,
        // see https://code.google.com/p/webrtc/issues/detail?id=4869
        // this was fixed in M56 along with unprefixing RTCPeerConnection.
        logging('PeerConnection');
        if (pcConfig && pcConfig.iceTransportPolicy) {
          pcConfig.iceTransports = pcConfig.iceTransportPolicy;
        }

        return new window.webkitRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype =
          window.webkitRTCPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      if (window.webkitRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return window.webkitRTCPeerConnection.generateCertificate;
          }
        });
      }
    } else {
      // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
      var OrigPeerConnection = window.RTCPeerConnection;
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
          var newIceServers = [];
          for (var i = 0; i < pcConfig.iceServers.length; i++) {
            var server = pcConfig.iceServers[i];
            if (!server.hasOwnProperty('urls') &&
                server.hasOwnProperty('url')) {
              console.warn('RTCIceServer.url is deprecated! Use urls instead.');
              server = JSON.parse(JSON.stringify(server));
              server.urls = server.url;
              newIceServers.push(server);
            } else {
              newIceServers.push(pcConfig.iceServers[i]);
            }
          }
          pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
        get: function() {
          return OrigPeerConnection.generateCertificate;
        }
      });
    }

    var origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function(selector,
        successCallback, errorCallback) {
      var self = this;
      var args = arguments;

      // If selector is a function then we are in the old style stats so just
      // pass back the original getStats format to avoid breaking old users.
      if (arguments.length > 0 && typeof selector === 'function') {
        return origGetStats.apply(this, arguments);
      }

      // When spec-style getStats is supported, return those when called with
      // either no arguments or the selector argument is null.
      if (origGetStats.length === 0 && (arguments.length === 0 ||
          typeof arguments[0] !== 'function')) {
        return origGetStats.apply(this, []);
      }

      var fixChromeStats_ = function(response) {
        var standardReport = {};
        var reports = response.result();
        reports.forEach(function(report) {
          var standardStats = {
            id: report.id,
            timestamp: report.timestamp,
            type: {
              localcandidate: 'local-candidate',
              remotecandidate: 'remote-candidate'
            }[report.type] || report.type
          };
          report.names().forEach(function(name) {
            standardStats[name] = report.stat(name);
          });
          standardReport[standardStats.id] = standardStats;
        });

        return standardReport;
      };

      // shim getStats with maplike support
      var makeMapStats = function(stats) {
        return new Map(Object.keys(stats).map(function(key) {
          return [key, stats[key]];
        }));
      };

      if (arguments.length >= 2) {
        var successCallbackWrapper_ = function(response) {
          args[1](makeMapStats(fixChromeStats_(response)));
        };

        return origGetStats.apply(this, [successCallbackWrapper_,
          arguments[0]]);
      }

      // promise-support
      return new Promise(function(resolve, reject) {
        origGetStats.apply(self, [
          function(response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          }, reject]);
      }).then(successCallback, errorCallback);
    };

    // add promise support -- natively available in Chrome 51
    if (browserDetails.version < 51) {
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
          .forEach(function(method) {
            var nativeMethod = window.RTCPeerConnection.prototype[method];
            window.RTCPeerConnection.prototype[method] = function() {
              var args = arguments;
              var self = this;
              var promise = new Promise(function(resolve, reject) {
                nativeMethod.apply(self, [args[0], resolve, reject]);
              });
              if (args.length < 2) {
                return promise;
              }
              return promise.then(function() {
                args[1].apply(null, []);
              },
              function(err) {
                if (args.length >= 3) {
                  args[2].apply(null, [err]);
                }
              });
            };
          });
    }

    // promise support for createOffer and createAnswer. Available (without
    // bugs) since M52: crbug/619289
    if (browserDetails.version < 52) {
      ['createOffer', 'createAnswer'].forEach(function(method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        window.RTCPeerConnection.prototype[method] = function() {
          var self = this;
          if (arguments.length < 1 || (arguments.length === 1 &&
              typeof arguments[0] === 'object')) {
            var opts = arguments.length === 1 ? arguments[0] : undefined;
            return new Promise(function(resolve, reject) {
              nativeMethod.apply(self, [resolve, reject, opts]);
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
    }

    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          window.RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  }
};


// Expose public methods.
module.exports = {
  shimMediaStream: chromeShim.shimMediaStream,
  shimOnTrack: chromeShim.shimOnTrack,
  shimAddTrack: chromeShim.shimAddTrack,
  shimGetSendersWithDtmf: chromeShim.shimGetSendersWithDtmf,
  shimSourceObject: chromeShim.shimSourceObject,
  shimPeerConnection: chromeShim.shimPeerConnection,
  shimGetUserMedia: __webpack_require__(13)
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

var utils = __webpack_require__(0);
var logging = utils.log;

// Expose public methods.
module.exports = function(window) {
  var browserDetails = utils.detectBrowser(window);
  var navigator = window && window.navigator;

  var constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    var cc = {};
    Object.keys(c).forEach(function(key) {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      var oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        var oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(function(mix) {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  var shimConstraints_ = function(constraints, func) {
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === 'object') {
      var remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile & surface pro.
      var face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});
      var getSupportedFacingModeLies = browserDetails.version < 61;

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode &&
            !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        var matches;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }
        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices()
          .then(function(devices) {
            devices = devices.filter(function(d) {
              return d.kind === 'videoinput';
            });
            var dev = devices.find(function(d) {
              return matches.some(function(match) {
                return d.label.toLowerCase().indexOf(match) !== -1;
              });
            });
            if (!dev && devices.length && matches.indexOf('back') !== -1) {
              dev = devices[devices.length - 1]; // more likely the back cam
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
                                                        {ideal: dev.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  var shimError_ = function(e) {
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        InvalidStateError: 'NotReadableError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotReadableError',
        MediaDeviceKillSwitchOn: 'NotReadableError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraintName,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  var getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, function(c) {
      navigator.webkitGetUserMedia(c, onSuccess, function(e) {
        onError(shimError_(e));
      });
    });
  };

  navigator.getUserMedia = getUserMedia_;

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      navigator.getUserMedia(constraints, resolve, reject);
    });
  };

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {
      getUserMedia: getUserMediaPromise_,
      enumerateDevices: function() {
        return new Promise(function(resolve) {
          var kinds = {audio: 'audioinput', video: 'videoinput'};
          return window.MediaStreamTrack.getSources(function(devices) {
            resolve(devices.map(function(device) {
              return {label: device.label,
                kind: kinds[device.kind],
                deviceId: device.id,
                groupId: ''};
            }));
          });
        });
      },
      getSupportedConstraints: function() {
        return {
          deviceId: true, echoCancellation: true, facingMode: true,
          frameRate: true, height: true, width: true
        };
      }
    };
  }

  // A shim for getUserMedia method on the mediaDevices object.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return getUserMediaPromise_(constraints);
    };
  } else {
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, function(c) {
        return origGetUserMedia(c).then(function(stream) {
          if (c.audio && !stream.getAudioTracks().length ||
              c.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach(function(track) {
              track.stop();
            });
            throw new DOMException('', 'NotFoundError');
          }
          return stream;
        }, function(e) {
          return Promise.reject(shimError_(e));
        });
      });
    };
  }

  // Dummy devicechange event methods.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
    navigator.mediaDevices.addEventListener = function() {
      logging('Dummy mediaDevices.addEventListener called.');
    };
  }
  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
    navigator.mediaDevices.removeEventListener = function() {
      logging('Dummy mediaDevices.removeEventListener called.');
    };
  }
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var utils = __webpack_require__(0);
var shimRTCPeerConnection = __webpack_require__(15);

module.exports = {
  shimGetUserMedia: __webpack_require__(17),
  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    if (window.RTCIceGatherer) {
      // ORTC defines an RTCIceCandidate object but no constructor.
      // Not implemented in Edge.
      if (!window.RTCIceCandidate) {
        window.RTCIceCandidate = function(args) {
          return args;
        };
      }
      // ORTC does not have a session description object but
      // other browsers (i.e. Chrome) that will support both PC and ORTC
      // in the future might have this defined already.
      if (!window.RTCSessionDescription) {
        window.RTCSessionDescription = function(args) {
          return args;
        };
      }
      // this adds an additional event listener to MediaStrackTrack that signals
      // when a tracks enabled property was changed. Workaround for a bug in
      // addStream, see below. No longer required in 15025+
      if (browserDetails.version < 15025) {
        var origMSTEnabled = Object.getOwnPropertyDescriptor(
            window.MediaStreamTrack.prototype, 'enabled');
        Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
          set: function(value) {
            origMSTEnabled.set.call(this, value);
            var ev = new Event('enabled');
            ev.enabled = value;
            this.dispatchEvent(ev);
          }
        });
      }
    }

    // ORTC defines the DTMF sender a bit different.
    // https://github.com/w3c/ortc/issues/714
    if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get: function() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = new window.RTCDtmfSender(this);
            } else if (this.track.kind === 'video') {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }

    window.RTCPeerConnection =
        shimRTCPeerConnection(window, browserDetails.version);
  },
  shimReplaceTrack: function(window) {
    // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
    if (window.RTCRtpSender &&
        !('replaceTrack' in window.RTCRtpSender.prototype)) {
      window.RTCRtpSender.prototype.replaceTrack =
          window.RTCRtpSender.prototype.setTrack;
    }
  }
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var SDPUtils = __webpack_require__(16);

// sort tracks such that they follow an a-v-a-v...
// pattern.
function sortTracks(tracks) {
  var audioTracks = tracks.filter(function(track) {
    return track.kind === 'audio';
  });
  var videoTracks = tracks.filter(function(track) {
    return track.kind === 'video';
  });
  tracks = [];
  while (audioTracks.length || videoTracks.length) {
    if (audioTracks.length) {
      tracks.push(audioTracks.shift());
    }
    if (videoTracks.length) {
      tracks.push(videoTracks.shift());
    }
  }
  return tracks;
}

// Edge does not like
// 1) stun:
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function(server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      if (server.url && !server.urls) {
        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
      }
      var isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(function(url) {
        var validTurn = url.indexOf('turn:') === 0 &&
            url.indexOf('transport=udp') !== -1 &&
            url.indexOf('turn:[') === -1 &&
            !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }
        return url.indexOf('stun:') === 0 && edgeVersion >= 14393;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
    return false;
  });
}

// Determines the intersection of local and remote capabilities.
function getCommonCapabilities(localCapabilities, remoteCapabilities) {
  var commonCapabilities = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: []
  };

  var findCodecByPayloadType = function(pt, codecs) {
    pt = parseInt(pt, 10);
    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].payloadType === pt ||
          codecs[i].preferredPayloadType === pt) {
        return codecs[i];
      }
    }
  };

  var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
    return lCodec && rCodec &&
        lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
  };

  localCapabilities.codecs.forEach(function(lCodec) {
    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
      var rCodec = remoteCapabilities.codecs[i];
      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
          lCodec.clockRate === rCodec.clockRate) {
        if (lCodec.name.toLowerCase() === 'rtx' &&
            lCodec.parameters && rCodec.parameters.apt) {
          // for RTX we need to find the local rtx that has a apt
          // which points to the same local codec as the remote one.
          if (!rtxCapabilityMatches(lCodec, rCodec,
              localCapabilities.codecs, remoteCapabilities.codecs)) {
            continue;
          }
        }
        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
        // number of channels is the highest common number of channels
        rCodec.numChannels = Math.min(lCodec.numChannels,
            rCodec.numChannels);
        // push rCodec so we reply with offerer payload type
        commonCapabilities.codecs.push(rCodec);

        // determine common feedback mechanisms
        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
            if (lCodec.rtcpFeedback[j].type === fb.type &&
                lCodec.rtcpFeedback[j].parameter === fb.parameter) {
              return true;
            }
          }
          return false;
        });
        // FIXME: also need to determine .parameters
        //  see https://github.com/openpeer/ortc/issues/569
        break;
      }
    }
  });

  localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
    for (var i = 0; i < remoteCapabilities.headerExtensions.length;
         i++) {
      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
      if (lHeaderExtension.uri === rHeaderExtension.uri) {
        commonCapabilities.headerExtensions.push(rHeaderExtension);
        break;
      }
    }
  });

  // FIXME: fecMechanisms
  return commonCapabilities;
}

// is action=setLocalDescription with type allowed in signalingState
function isActionAllowedInSignalingState(action, type, signalingState) {
  return {
    offer: {
      setLocalDescription: ['stable', 'have-local-offer'],
      setRemoteDescription: ['stable', 'have-remote-offer']
    },
    answer: {
      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
    }
  }[type][action].indexOf(signalingState) !== -1;
}

module.exports = function(window, edgeVersion) {
  var RTCPeerConnection = function(config) {
    var self = this;

    var _eventTarget = document.createDocumentFragment();
    ['addEventListener', 'removeEventListener', 'dispatchEvent']
        .forEach(function(method) {
          self[method] = _eventTarget[method].bind(_eventTarget);
        });

    this.needNegotiation = false;

    this.onicecandidate = null;
    this.onaddstream = null;
    this.ontrack = null;
    this.onremovestream = null;
    this.onsignalingstatechange = null;
    this.oniceconnectionstatechange = null;
    this.onicegatheringstatechange = null;
    this.onnegotiationneeded = null;
    this.ondatachannel = null;
    this.canTrickleIceCandidates = null;

    this.localStreams = [];
    this.remoteStreams = [];
    this.getLocalStreams = function() {
      return self.localStreams;
    };
    this.getRemoteStreams = function() {
      return self.remoteStreams;
    };

    this.localDescription = new window.RTCSessionDescription({
      type: '',
      sdp: ''
    });
    this.remoteDescription = new window.RTCSessionDescription({
      type: '',
      sdp: ''
    });
    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.iceGatheringState = 'new';

    this.iceOptions = {
      gatherPolicy: 'all',
      iceServers: []
    };
    if (config && config.iceTransportPolicy) {
      switch (config.iceTransportPolicy) {
        case 'all':
        case 'relay':
          this.iceOptions.gatherPolicy = config.iceTransportPolicy;
          break;
        default:
          // don't set iceTransportPolicy.
          break;
      }
    }
    this.usingBundle = config && config.bundlePolicy === 'max-bundle';

    if (config && config.iceServers) {
      this.iceOptions.iceServers = filterIceServers(config.iceServers,
          edgeVersion);
    }
    this._config = config || {};

    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.
    this.transceivers = [];

    // since the iceGatherer is currently created in createOffer but we
    // must not emit candidates until after setLocalDescription we buffer
    // them in this array.
    this._localIceCandidatesBuffer = [];

    this._sdpSessionId = SDPUtils.generateSessionId();
  };

  RTCPeerConnection.prototype._emitGatheringStateChange = function() {
    var event = new Event('icegatheringstatechange');
    this.dispatchEvent(event);
    if (this.onicegatheringstatechange !== null) {
      this.onicegatheringstatechange(event);
    }
  };

  RTCPeerConnection.prototype._emitBufferedCandidates = function() {
    var self = this;
    var sections = SDPUtils.splitSections(self.localDescription.sdp);
    // FIXME: need to apply ice candidates in a way which is async but
    // in-order
    this._localIceCandidatesBuffer.forEach(function(event) {
      var end = !event.candidate || Object.keys(event.candidate).length === 0;
      if (end) {
        for (var j = 1; j < sections.length; j++) {
          if (sections[j].indexOf('\r\na=end-of-candidates\r\n') === -1) {
            sections[j] += 'a=end-of-candidates\r\n';
          }
        }
      } else {
        sections[event.candidate.sdpMLineIndex + 1] +=
            'a=' + event.candidate.candidate + '\r\n';
      }
      self.localDescription.sdp = sections.join('');
      self.dispatchEvent(event);
      if (self.onicecandidate !== null) {
        self.onicecandidate(event);
      }
      if (!event.candidate && self.iceGatheringState !== 'complete') {
        var complete = self.transceivers.every(function(transceiver) {
          return transceiver.iceGatherer &&
              transceiver.iceGatherer.state === 'completed';
        });
        if (complete && self.iceGatheringStateChange !== 'complete') {
          self.iceGatheringState = 'complete';
          self._emitGatheringStateChange();
        }
      }
    });
    this._localIceCandidatesBuffer = [];
  };

  RTCPeerConnection.prototype.getConfiguration = function() {
    return this._config;
  };

  // internal helper to create a transceiver object.
  // (whih is not yet the same as the WebRTC 1.0 transceiver)
  RTCPeerConnection.prototype._createTransceiver = function(kind) {
    var hasBundleTransport = this.transceivers.length > 0;
    var transceiver = {
      track: null,
      iceGatherer: null,
      iceTransport: null,
      dtlsTransport: null,
      localCapabilities: null,
      remoteCapabilities: null,
      rtpSender: null,
      rtpReceiver: null,
      kind: kind,
      mid: null,
      sendEncodingParameters: null,
      recvEncodingParameters: null,
      stream: null,
      wantReceive: true
    };
    if (this.usingBundle && hasBundleTransport) {
      transceiver.iceTransport = this.transceivers[0].iceTransport;
      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
    } else {
      var transports = this._createIceAndDtlsTransports();
      transceiver.iceTransport = transports.iceTransport;
      transceiver.dtlsTransport = transports.dtlsTransport;
    }
    this.transceivers.push(transceiver);
    return transceiver;
  };

  RTCPeerConnection.prototype.addTrack = function(track, stream) {
    var transceiver;
    for (var i = 0; i < this.transceivers.length; i++) {
      if (!this.transceivers[i].track &&
          this.transceivers[i].kind === track.kind) {
        transceiver = this.transceivers[i];
      }
    }
    if (!transceiver) {
      transceiver = this._createTransceiver(track.kind);
    }

    transceiver.track = track;
    transceiver.stream = stream;
    transceiver.rtpSender = new window.RTCRtpSender(track,
        transceiver.dtlsTransport);

    this._maybeFireNegotiationNeeded();
    return transceiver.rtpSender;
  };

  RTCPeerConnection.prototype.addStream = function(stream) {
    var self = this;
    if (edgeVersion >= 15025) {
      this.localStreams.push(stream);
      stream.getTracks().forEach(function(track) {
        self.addTrack(track, stream);
      });
    } else {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      // Fixed in 15025 (or earlier)
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function(track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function(event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      clonedStream.getTracks().forEach(function(track) {
        self.addTrack(track, clonedStream);
      });
      this.localStreams.push(clonedStream);
    }
    this._maybeFireNegotiationNeeded();
  };

  RTCPeerConnection.prototype.removeStream = function(stream) {
    var idx = this.localStreams.indexOf(stream);
    if (idx > -1) {
      this.localStreams.splice(idx, 1);
      this._maybeFireNegotiationNeeded();
    }
  };

  RTCPeerConnection.prototype.getSenders = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpSender;
    })
    .map(function(transceiver) {
      return transceiver.rtpSender;
    });
  };

  RTCPeerConnection.prototype.getReceivers = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpReceiver;
    })
    .map(function(transceiver) {
      return transceiver.rtpReceiver;
    });
  };

  // Create ICE gatherer and hook it up.
  RTCPeerConnection.prototype._createIceGatherer = function(mid,
      sdpMLineIndex) {
    var self = this;
    var iceGatherer = new window.RTCIceGatherer(self.iceOptions);
    iceGatherer.onlocalcandidate = function(evt) {
      var event = new Event('icecandidate');
      event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

      var cand = evt.candidate;
      var end = !cand || Object.keys(cand).length === 0;
      // Edge emits an empty object for RTCIceCandidateComplete‥
      if (end) {
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        if (iceGatherer.state === undefined) {
          iceGatherer.state = 'completed';
        }
      } else {
        // RTCIceCandidate doesn't have a component, needs to be added
        cand.component = 1;
        event.candidate.candidate = SDPUtils.writeCandidate(cand);
      }

      // update local description.
      var sections = SDPUtils.splitSections(self.localDescription.sdp);
      if (!end) {
        sections[event.candidate.sdpMLineIndex + 1] +=
            'a=' + event.candidate.candidate + '\r\n';
      } else {
        sections[event.candidate.sdpMLineIndex + 1] +=
            'a=end-of-candidates\r\n';
      }
      self.localDescription.sdp = sections.join('');
      var transceivers = self._pendingOffer ? self._pendingOffer :
          self.transceivers;
      var complete = transceivers.every(function(transceiver) {
        return transceiver.iceGatherer &&
            transceiver.iceGatherer.state === 'completed';
      });

      // Emit candidate if localDescription is set.
      // Also emits null candidate when all gatherers are complete.
      switch (self.iceGatheringState) {
        case 'new':
          if (!end) {
            self._localIceCandidatesBuffer.push(event);
          }
          if (end && complete) {
            self._localIceCandidatesBuffer.push(
                new Event('icecandidate'));
          }
          break;
        case 'gathering':
          self._emitBufferedCandidates();
          if (!end) {
            self.dispatchEvent(event);
            if (self.onicecandidate !== null) {
              self.onicecandidate(event);
            }
          }
          if (complete) {
            self.dispatchEvent(new Event('icecandidate'));
            if (self.onicecandidate !== null) {
              self.onicecandidate(new Event('icecandidate'));
            }
            self.iceGatheringState = 'complete';
            self._emitGatheringStateChange();
          }
          break;
        case 'complete':
          // should not happen... currently!
          break;
        default: // no-op.
          break;
      }
    };
    return iceGatherer;
  };

  // Create ICE transport and DTLS transport.
  RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
    var self = this;
    var iceTransport = new window.RTCIceTransport(null);
    iceTransport.onicestatechange = function() {
      self._updateConnectionState();
    };

    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
    dtlsTransport.ondtlsstatechange = function() {
      self._updateConnectionState();
    };
    dtlsTransport.onerror = function() {
      // onerror does not set state to failed by itself.
      Object.defineProperty(dtlsTransport, 'state',
          {value: 'failed', writable: true});
      self._updateConnectionState();
    };

    return {
      iceTransport: iceTransport,
      dtlsTransport: dtlsTransport
    };
  };

  // Destroy ICE gatherer, ICE transport and DTLS transport.
  // Without triggering the callbacks.
  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
      sdpMLineIndex) {
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer) {
      delete iceGatherer.onlocalcandidate;
      delete this.transceivers[sdpMLineIndex].iceGatherer;
    }
    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
    if (iceTransport) {
      delete iceTransport.onicestatechange;
      delete this.transceivers[sdpMLineIndex].iceTransport;
    }
    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
    if (dtlsTransport) {
      delete dtlsTransport.ondtlsstatechange;
      delete dtlsTransport.onerror;
      delete this.transceivers[sdpMLineIndex].dtlsTransport;
    }
  };

  // Start the RTP Sender and Receiver for a transceiver.
  RTCPeerConnection.prototype._transceive = function(transceiver,
      send, recv) {
    var params = getCommonCapabilities(transceiver.localCapabilities,
        transceiver.remoteCapabilities);
    if (send && transceiver.rtpSender) {
      params.encodings = transceiver.sendEncodingParameters;
      params.rtcp = {
        cname: SDPUtils.localCName,
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.recvEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
      }
      transceiver.rtpSender.send(params);
    }
    if (recv && transceiver.rtpReceiver) {
      // remove RTX field in Edge 14942
      if (transceiver.kind === 'video'
          && transceiver.recvEncodingParameters
          && edgeVersion < 15019) {
        transceiver.recvEncodingParameters.forEach(function(p) {
          delete p.rtx;
        });
      }
      params.encodings = transceiver.recvEncodingParameters;
      params.rtcp = {
        cname: transceiver.rtcpParameters.cname,
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.sendEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
      }
      transceiver.rtpReceiver.receive(params);
    }
  };

  RTCPeerConnection.prototype.setLocalDescription = function(description) {
    var self = this;

    if (!isActionAllowedInSignalingState('setLocalDescription',
        description.type, this.signalingState)) {
      var e = new Error('Can not set local ' + description.type +
          ' in state ' + this.signalingState);
      e.name = 'InvalidStateError';
      if (arguments.length > 2 && typeof arguments[2] === 'function') {
        window.setTimeout(arguments[2], 0, e);
      }
      return Promise.reject(e);
    }

    var sections;
    var sessionpart;
    if (description.type === 'offer') {
      // FIXME: What was the purpose of this empty if statement?
      // if (!this._pendingOffer) {
      // } else {
      if (this._pendingOffer) {
        // VERY limited support for SDP munging. Limited to:
        // * changing the order of codecs
        sections = SDPUtils.splitSections(description.sdp);
        sessionpart = sections.shift();
        sections.forEach(function(mediaSection, sdpMLineIndex) {
          var caps = SDPUtils.parseRtpParameters(mediaSection);
          self._pendingOffer[sdpMLineIndex].localCapabilities = caps;
        });
        this.transceivers = this._pendingOffer;
        delete this._pendingOffer;
      }
    } else if (description.type === 'answer') {
      sections = SDPUtils.splitSections(self.remoteDescription.sdp);
      sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart,
          'a=ice-lite').length > 0;
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var transceiver = self.transceivers[sdpMLineIndex];
        var iceGatherer = transceiver.iceGatherer;
        var iceTransport = transceiver.iceTransport;
        var dtlsTransport = transceiver.dtlsTransport;
        var localCapabilities = transceiver.localCapabilities;
        var remoteCapabilities = transceiver.remoteCapabilities;

        var rejected = SDPUtils.isRejected(mediaSection);

        if (!rejected && !transceiver.isDatachannel) {
          var remoteIceParameters = SDPUtils.getIceParameters(
              mediaSection, sessionpart);
          var remoteDtlsParameters = SDPUtils.getDtlsParameters(
              mediaSection, sessionpart);
          if (isIceLite) {
            remoteDtlsParameters.role = 'server';
          }

          if (!self.usingBundle || sdpMLineIndex === 0) {
            iceTransport.start(iceGatherer, remoteIceParameters,
                isIceLite ? 'controlling' : 'controlled');
            dtlsTransport.start(remoteDtlsParameters);
          }

          // Calculate intersection of capabilities.
          var params = getCommonCapabilities(localCapabilities,
              remoteCapabilities);

          // Start the RTCRtpSender. The RTCRtpReceiver for this
          // transceiver has already been started in setRemoteDescription.
          self._transceive(transceiver,
              params.codecs.length > 0,
              false);
        }
      });
    }

    this.localDescription = {
      type: description.type,
      sdp: description.sdp
    };
    switch (description.type) {
      case 'offer':
        this._updateSignalingState('have-local-offer');
        break;
      case 'answer':
        this._updateSignalingState('stable');
        break;
      default:
        throw new TypeError('unsupported type "' + description.type +
            '"');
    }

    // If a success callback was provided, emit ICE candidates after it
    // has been executed. Otherwise, emit callback after the Promise is
    // resolved.
    var hasCallback = arguments.length > 1 &&
      typeof arguments[1] === 'function';
    if (hasCallback) {
      var cb = arguments[1];
      window.setTimeout(function() {
        cb();
        if (self.iceGatheringState === 'new') {
          self.iceGatheringState = 'gathering';
          self._emitGatheringStateChange();
        }
        self._emitBufferedCandidates();
      }, 0);
    }
    var p = Promise.resolve();
    p.then(function() {
      if (!hasCallback) {
        if (self.iceGatheringState === 'new') {
          self.iceGatheringState = 'gathering';
          self._emitGatheringStateChange();
        }
        // Usually candidates will be emitted earlier.
        window.setTimeout(self._emitBufferedCandidates.bind(self), 500);
      }
    });
    return p;
  };

  RTCPeerConnection.prototype.setRemoteDescription = function(description) {
    var self = this;

    if (!isActionAllowedInSignalingState('setRemoteDescription',
        description.type, this.signalingState)) {
      var e = new Error('Can not set remote ' + description.type +
          ' in state ' + this.signalingState);
      e.name = 'InvalidStateError';
      if (arguments.length > 2 && typeof arguments[2] === 'function') {
        window.setTimeout(arguments[2], 0, e);
      }
      return Promise.reject(e);
    }

    var streams = {};
    var receiverList = [];
    var sections = SDPUtils.splitSections(description.sdp);
    var sessionpart = sections.shift();
    var isIceLite = SDPUtils.matchPrefix(sessionpart,
        'a=ice-lite').length > 0;
    var usingBundle = SDPUtils.matchPrefix(sessionpart,
        'a=group:BUNDLE ').length > 0;
    this.usingBundle = usingBundle;
    var iceOptions = SDPUtils.matchPrefix(sessionpart,
        'a=ice-options:')[0];
    if (iceOptions) {
      this.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
          .indexOf('trickle') >= 0;
    } else {
      this.canTrickleIceCandidates = false;
    }

    sections.forEach(function(mediaSection, sdpMLineIndex) {
      var lines = SDPUtils.splitLines(mediaSection);
      var kind = SDPUtils.getKind(mediaSection);
      var rejected = SDPUtils.isRejected(mediaSection);
      var protocol = lines[0].substr(2).split(' ')[2];

      var direction = SDPUtils.getDirection(mediaSection, sessionpart);
      var remoteMsid = SDPUtils.parseMsid(mediaSection);

      var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();

      // Reject datachannels which are not implemented yet.
      if (kind === 'application' && protocol === 'DTLS/SCTP') {
        self.transceivers[sdpMLineIndex] = {
          mid: mid,
          isDatachannel: true
        };
        return;
      }

      var transceiver;
      var iceGatherer;
      var iceTransport;
      var dtlsTransport;
      var rtpReceiver;
      var sendEncodingParameters;
      var recvEncodingParameters;
      var localCapabilities;

      var track;
      // FIXME: ensure the mediaSection has rtcp-mux set.
      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
      var remoteIceParameters;
      var remoteDtlsParameters;
      if (!rejected) {
        remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters.role = 'client';
      }
      recvEncodingParameters =
          SDPUtils.parseRtpEncodingParameters(mediaSection);

      var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);

      var isComplete = SDPUtils.matchPrefix(mediaSection,
          'a=end-of-candidates', sessionpart).length > 0;
      var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
          .map(function(cand) {
            return SDPUtils.parseCandidate(cand);
          })
          .filter(function(cand) {
            return cand.component === '1' || cand.component === 1;
          });

      // Check if we can use BUNDLE and dispose transports.
      if ((description.type === 'offer' || description.type === 'answer') &&
          !rejected && usingBundle && sdpMLineIndex > 0 &&
          self.transceivers[sdpMLineIndex]) {
        self._disposeIceAndDtlsTransports(sdpMLineIndex);
        self.transceivers[sdpMLineIndex].iceGatherer =
            self.transceivers[0].iceGatherer;
        self.transceivers[sdpMLineIndex].iceTransport =
            self.transceivers[0].iceTransport;
        self.transceivers[sdpMLineIndex].dtlsTransport =
            self.transceivers[0].dtlsTransport;
        if (self.transceivers[sdpMLineIndex].rtpSender) {
          self.transceivers[sdpMLineIndex].rtpSender.setTransport(
              self.transceivers[0].dtlsTransport);
        }
        if (self.transceivers[sdpMLineIndex].rtpReceiver) {
          self.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
              self.transceivers[0].dtlsTransport);
        }
      }
      if (description.type === 'offer' && !rejected) {
        transceiver = self.transceivers[sdpMLineIndex] ||
            self._createTransceiver(kind);
        transceiver.mid = mid;

        if (!transceiver.iceGatherer) {
          transceiver.iceGatherer = usingBundle && sdpMLineIndex > 0 ?
              self.transceivers[0].iceGatherer :
              self._createIceGatherer(mid, sdpMLineIndex);
        }

        if (isComplete && cands.length &&
            (!usingBundle || sdpMLineIndex === 0)) {
          transceiver.iceTransport.setRemoteCandidates(cands);
        }

        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

        // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js
        if (edgeVersion < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(
              function(codec) {
                return codec.name !== 'rtx';
              });
        }

        sendEncodingParameters = [{
          ssrc: (2 * sdpMLineIndex + 2) * 1001
        }];

        if (direction === 'sendrecv' || direction === 'sendonly') {
          rtpReceiver = new window.RTCRtpReceiver(transceiver.dtlsTransport,
              kind);

          track = rtpReceiver.track;
          // FIXME: does not work with Plan B.
          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
              Object.defineProperty(streams[remoteMsid.stream], 'id', {
                get: function() {
                  return remoteMsid.stream;
                }
              });
            }
            Object.defineProperty(track, 'id', {
              get: function() {
                return remoteMsid.track;
              }
            });
            streams[remoteMsid.stream].addTrack(track);
            receiverList.push([track, rtpReceiver,
              streams[remoteMsid.stream]]);
          } else {
            if (!streams.default) {
              streams.default = new window.MediaStream();
            }
            streams.default.addTrack(track);
            receiverList.push([track, rtpReceiver, streams.default]);
          }
        }

        transceiver.localCapabilities = localCapabilities;
        transceiver.remoteCapabilities = remoteCapabilities;
        transceiver.rtpReceiver = rtpReceiver;
        transceiver.rtcpParameters = rtcpParameters;
        transceiver.sendEncodingParameters = sendEncodingParameters;
        transceiver.recvEncodingParameters = recvEncodingParameters;

        // Start the RTCRtpReceiver now. The RTPSender is started in
        // setLocalDescription.
        self._transceive(self.transceivers[sdpMLineIndex],
            false,
            direction === 'sendrecv' || direction === 'sendonly');
      } else if (description.type === 'answer' && !rejected) {
        transceiver = self.transceivers[sdpMLineIndex];
        iceGatherer = transceiver.iceGatherer;
        iceTransport = transceiver.iceTransport;
        dtlsTransport = transceiver.dtlsTransport;
        rtpReceiver = transceiver.rtpReceiver;
        sendEncodingParameters = transceiver.sendEncodingParameters;
        localCapabilities = transceiver.localCapabilities;

        self.transceivers[sdpMLineIndex].recvEncodingParameters =
            recvEncodingParameters;
        self.transceivers[sdpMLineIndex].remoteCapabilities =
            remoteCapabilities;
        self.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

        if (!usingBundle || sdpMLineIndex === 0) {
          if ((isIceLite || isComplete) && cands.length) {
            iceTransport.setRemoteCandidates(cands);
          }
          iceTransport.start(iceGatherer, remoteIceParameters,
              'controlling');
          dtlsTransport.start(remoteDtlsParameters);
        }

        self._transceive(transceiver,
            direction === 'sendrecv' || direction === 'recvonly',
            direction === 'sendrecv' || direction === 'sendonly');

        if (rtpReceiver &&
            (direction === 'sendrecv' || direction === 'sendonly')) {
          track = rtpReceiver.track;
          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
            }
            streams[remoteMsid.stream].addTrack(track);
            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
          } else {
            if (!streams.default) {
              streams.default = new window.MediaStream();
            }
            streams.default.addTrack(track);
            receiverList.push([track, rtpReceiver, streams.default]);
          }
        } else {
          // FIXME: actually the receiver should be created later.
          delete transceiver.rtpReceiver;
        }
      }
    });

    this.remoteDescription = {
      type: description.type,
      sdp: description.sdp
    };
    switch (description.type) {
      case 'offer':
        this._updateSignalingState('have-remote-offer');
        break;
      case 'answer':
        this._updateSignalingState('stable');
        break;
      default:
        throw new TypeError('unsupported type "' + description.type +
            '"');
    }
    Object.keys(streams).forEach(function(sid) {
      var stream = streams[sid];
      if (stream.getTracks().length) {
        self.remoteStreams.push(stream);
        var event = new Event('addstream');
        event.stream = stream;
        self.dispatchEvent(event);
        if (self.onaddstream !== null) {
          window.setTimeout(function() {
            self.onaddstream(event);
          }, 0);
        }

        receiverList.forEach(function(item) {
          var track = item[0];
          var receiver = item[1];
          if (stream.id !== item[2].id) {
            return;
          }
          var trackEvent = new Event('track');
          trackEvent.track = track;
          trackEvent.receiver = receiver;
          trackEvent.streams = [stream];
          self.dispatchEvent(trackEvent);
          if (self.ontrack !== null) {
            window.setTimeout(function() {
              self.ontrack(trackEvent);
            }, 0);
          }
        });
      }
    });

    // check whether addIceCandidate({}) was called within four seconds after
    // setRemoteDescription.
    window.setTimeout(function() {
      if (!(self && self.transceivers)) {
        return;
      }
      self.transceivers.forEach(function(transceiver) {
        if (transceiver.iceTransport &&
            transceiver.iceTransport.state === 'new' &&
            transceiver.iceTransport.getRemoteCandidates().length > 0) {
          console.warn('Timeout for addRemoteCandidate. Consider sending ' +
              'an end-of-candidates notification');
          transceiver.iceTransport.addRemoteCandidate({});
        }
      });
    }, 4000);

    if (arguments.length > 1 && typeof arguments[1] === 'function') {
      window.setTimeout(arguments[1], 0);
    }
    return Promise.resolve();
  };

  RTCPeerConnection.prototype.close = function() {
    this.transceivers.forEach(function(transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }
      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }
      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }
      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    });
    // FIXME: clean up tracks, local streams, remote streams, etc
    this._updateSignalingState('closed');
  };

  // Update the signaling state.
  RTCPeerConnection.prototype._updateSignalingState = function(newState) {
    this.signalingState = newState;
    var event = new Event('signalingstatechange');
    this.dispatchEvent(event);
    if (this.onsignalingstatechange !== null) {
      this.onsignalingstatechange(event);
    }
  };

  // Determine whether to fire the negotiationneeded event.
  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
    var self = this;
    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
      return;
    }
    this.needNegotiation = true;
    window.setTimeout(function() {
      if (self.needNegotiation === false) {
        return;
      }
      self.needNegotiation = false;
      var event = new Event('negotiationneeded');
      self.dispatchEvent(event);
      if (self.onnegotiationneeded !== null) {
        self.onnegotiationneeded(event);
      }
    }, 0);
  };

  // Update the connection state.
  RTCPeerConnection.prototype._updateConnectionState = function() {
    var self = this;
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      connecting: 0,
      checking: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      states[transceiver.iceTransport.state]++;
      states[transceiver.dtlsTransport.state]++;
    });
    // ICETransport.completed and connected are the same for this purpose.
    states.connected += states.completed;

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.connecting > 0 || states.checking > 0) {
      newState = 'connecting';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0 || states.completed > 0) {
      newState = 'connected';
    }

    if (newState !== self.iceConnectionState) {
      self.iceConnectionState = newState;
      var event = new Event('iceconnectionstatechange');
      this.dispatchEvent(event);
      if (this.oniceconnectionstatechange !== null) {
        this.oniceconnectionstatechange(event);
      }
    }
  };

  RTCPeerConnection.prototype.createOffer = function() {
    var self = this;
    if (this._pendingOffer) {
      throw new Error('createOffer called while there is a pending offer.');
    }
    var offerOptions;
    if (arguments.length === 1 && typeof arguments[0] !== 'function') {
      offerOptions = arguments[0];
    } else if (arguments.length === 3) {
      offerOptions = arguments[2];
    }

    var numAudioTracks = this.transceivers.filter(function(t) {
      return t.kind === 'audio';
    }).length;
    var numVideoTracks = this.transceivers.filter(function(t) {
      return t.kind === 'video';
    }).length;

    // Determine number of audio and video tracks we need to send/recv.
    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError(
            'Legacy mandatory/optional constraints not supported.');
      }
      if (offerOptions.offerToReceiveAudio !== undefined) {
        if (offerOptions.offerToReceiveAudio === true) {
          numAudioTracks = 1;
        } else if (offerOptions.offerToReceiveAudio === false) {
          numAudioTracks = 0;
        } else {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
      }
      if (offerOptions.offerToReceiveVideo !== undefined) {
        if (offerOptions.offerToReceiveVideo === true) {
          numVideoTracks = 1;
        } else if (offerOptions.offerToReceiveVideo === false) {
          numVideoTracks = 0;
        } else {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
    }

    this.transceivers.forEach(function(transceiver) {
      if (transceiver.kind === 'audio') {
        numAudioTracks--;
        if (numAudioTracks < 0) {
          transceiver.wantReceive = false;
        }
      } else if (transceiver.kind === 'video') {
        numVideoTracks--;
        if (numVideoTracks < 0) {
          transceiver.wantReceive = false;
        }
      }
    });

    // Create M-lines for recvonly streams.
    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        this._createTransceiver('audio');
        numAudioTracks--;
      }
      if (numVideoTracks > 0) {
        this._createTransceiver('video');
        numVideoTracks--;
      }
    }
    // reorder tracks
    var transceivers = sortTracks(this.transceivers);

    var sdp = SDPUtils.writeSessionBoilerplate(this._sdpSessionId);
    transceivers.forEach(function(transceiver, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = transceiver.track;
      var kind = transceiver.kind;
      var mid = SDPUtils.generateIdentifier();
      transceiver.mid = mid;

      if (!transceiver.iceGatherer) {
        transceiver.iceGatherer = self.usingBundle && sdpMLineIndex > 0 ?
            transceivers[0].iceGatherer :
            self._createIceGatherer(mid, sdpMLineIndex);
      }

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
      // filter RTX until additional stuff needed for RTX is implemented
      // in adapter.js
      if (edgeVersion < 15019) {
        localCapabilities.codecs = localCapabilities.codecs.filter(
            function(codec) {
              return codec.name !== 'rtx';
            });
      }
      localCapabilities.codecs.forEach(function(codec) {
        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
        // by adding level-asymmetry-allowed=1
        if (codec.name === 'H264' &&
            codec.parameters['level-asymmetry-allowed'] === undefined) {
          codec.parameters['level-asymmetry-allowed'] = '1';
        }
      });

      // generate an ssrc now, to be used later in rtpSender.send
      var sendEncodingParameters = [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];
      if (track) {
        // add RTX
        if (edgeVersion >= 15019 && kind === 'video') {
          sendEncodingParameters[0].rtx = {
            ssrc: (2 * sdpMLineIndex + 1) * 1001 + 1
          };
        }
      }

      if (transceiver.wantReceive) {
        transceiver.rtpReceiver = new window.RTCRtpReceiver(
          transceiver.dtlsTransport,
          kind
        );
      }

      transceiver.localCapabilities = localCapabilities;
      transceiver.sendEncodingParameters = sendEncodingParameters;
    });

    // always offer BUNDLE and dispose on return if not supported.
    if (this._config.bundlePolicy !== 'max-compat') {
      sdp += 'a=group:BUNDLE ' + transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp += 'a=ice-options:trickle\r\n';

    transceivers.forEach(function(transceiver, sdpMLineIndex) {
      sdp += SDPUtils.writeMediaSection(transceiver,
          transceiver.localCapabilities, 'offer', transceiver.stream);
      sdp += 'a=rtcp-rsize\r\n';
    });

    this._pendingOffer = transceivers;
    var desc = new window.RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    });
    if (arguments.length && typeof arguments[0] === 'function') {
      window.setTimeout(arguments[0], 0, desc);
    }
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.createAnswer = function() {
    var sdp = SDPUtils.writeSessionBoilerplate(this._sdpSessionId);
    if (this.usingBundle) {
      sdp += 'a=group:BUNDLE ' + this.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    this.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      if (transceiver.isDatachannel) {
        sdp += 'm=application 0 DTLS/SCTP 5000\r\n' +
            'c=IN IP4 0.0.0.0\r\n' +
            'a=mid:' + transceiver.mid + '\r\n';
        return;
      }

      // FIXME: look at direction.
      if (transceiver.stream) {
        var localTrack;
        if (transceiver.kind === 'audio') {
          localTrack = transceiver.stream.getAudioTracks()[0];
        } else if (transceiver.kind === 'video') {
          localTrack = transceiver.stream.getVideoTracks()[0];
        }
        if (localTrack) {
          // add RTX
          if (edgeVersion >= 15019 && transceiver.kind === 'video') {
            transceiver.sendEncodingParameters[0].rtx = {
              ssrc: (2 * sdpMLineIndex + 2) * 1001 + 1
            };
          }
        }
      }

      // Calculate intersection of capabilities.
      var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

      var hasRtx = commonCapabilities.codecs.filter(function(c) {
        return c.name.toLowerCase() === 'rtx';
      }).length;
      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
        delete transceiver.sendEncodingParameters[0].rtx;
      }

      sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities,
          'answer', transceiver.stream);
      if (transceiver.rtcpParameters &&
          transceiver.rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'answer',
      sdp: sdp
    });
    if (arguments.length && typeof arguments[0] === 'function') {
      window.setTimeout(arguments[0], 0, desc);
    }
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
    if (!candidate) {
      for (var j = 0; j < this.transceivers.length; j++) {
        this.transceivers[j].iceTransport.addRemoteCandidate({});
        if (this.usingBundle) {
          return Promise.resolve();
        }
      }
    } else {
      var mLineIndex = candidate.sdpMLineIndex;
      if (candidate.sdpMid) {
        for (var i = 0; i < this.transceivers.length; i++) {
          if (this.transceivers[i].mid === candidate.sdpMid) {
            mLineIndex = i;
            break;
          }
        }
      }
      var transceiver = this.transceivers[mLineIndex];
      if (transceiver) {
        var cand = Object.keys(candidate.candidate).length > 0 ?
            SDPUtils.parseCandidate(candidate.candidate) : {};
        // Ignore Chrome's invalid candidates since Edge does not like them.
        if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
          return Promise.resolve();
        }
        // Ignore RTCP candidates, we assume RTCP-MUX.
        if (cand.component &&
            !(cand.component === '1' || cand.component === 1)) {
          return Promise.resolve();
        }
        transceiver.iceTransport.addRemoteCandidate(cand);

        // update the remoteDescription.
        var sections = SDPUtils.splitSections(this.remoteDescription.sdp);
        sections[mLineIndex + 1] += (cand.type ? candidate.candidate.trim()
            : 'a=end-of-candidates') + '\r\n';
        this.remoteDescription.sdp = sections.join('');
      }
    }
    if (arguments.length > 1 && typeof arguments[1] === 'function') {
      window.setTimeout(arguments[1], 0);
    }
    return Promise.resolve();
  };

  RTCPeerConnection.prototype.getStats = function() {
    var promises = [];
    this.transceivers.forEach(function(transceiver) {
      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
        'dtlsTransport'].forEach(function(method) {
          if (transceiver[method]) {
            promises.push(transceiver[method].getStats());
          }
        });
    });
    var cb = arguments.length > 1 && typeof arguments[1] === 'function' &&
        arguments[1];
    var fixStatsType = function(stat) {
      return {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      }[stat.type] || stat.type;
    };
    return new Promise(function(resolve) {
      // shim getStats with maplike support
      var results = new Map();
      Promise.all(promises).then(function(res) {
        res.forEach(function(result) {
          Object.keys(result).forEach(function(id) {
            result[id].type = fixStatsType(result[id]);
            results.set(id, result[id]);
          });
        });
        if (cb) {
          window.setTimeout(cb, 0, results);
        }
        resolve(results);
      });
    });
  };
  return RTCPeerConnection;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-env node */


// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress); // was: relAddr
    sdp.push('rport');
    sdp.push(candidate.relatedPort); // was: relPort
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  if (candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.ufrag);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
}

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  // was: channels
  parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
          ? '/' + headerExtension.direction
          : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      params.push(param + '=' + codec.parameters[param]);
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
}

SDPUtils.parseFingerprint = function(line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
      'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var iceParameters = {
    usernameFragment: lines.filter(function(line) {
      return line.indexOf('a=ice-ufrag:') === 0;
    })[0].substr(12),
    password: lines.filter(function(line) {
      return line.indexOf('a=ice-pwd:') === 0;
    })[0].substr(10)
  };
  return iceParameters;
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
          mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
          mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  caps.headerExtensions.forEach(function(extension) {
    sdp += SDPUtils.writeExtmap(extension);
  });
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
  .map(function(line) {
    var parts = line.split(' ');
    parts.shift();
    return parts.map(function(part) {
      return parseInt(part, 10);
    });
  });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10),
        rtx: {
          ssrc: secondarySsrc
        }
      };
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: secondarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
          - (50 * 40 * 8);
    } else {
      bandwidth = undefined;
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  var cname;
  // Gets the first SSRC. Note that with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(obj) {
        return obj.attribute === 'cname';
      })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'msid';
  });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
  return Math.random().toString().substr(2, 21);
};

// Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;
  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=thisisadapterortc ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

// Expose public methods.
module.exports = SDPUtils;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


// Expose public methods.
module.exports = function(window) {
  var navigator = window && window.navigator;

  var shimError_ = function(e) {
    return {
      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name;
      }
    };
  };

  // getUserMedia error shim.
  var origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(c) {
    return origGetUserMedia(c).catch(function(e) {
      return Promise.reject(shimError_(e));
    });
  };
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var utils = __webpack_require__(0);

var firefoxShim = {
  shimOnTrack: function(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            e.stream.getTracks().forEach(function(track) {
              var event = new Event('track');
              event.track = track;
              event.receiver = {track: track};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        }
      });
    }
  },

  shimSourceObject: function(window) {
    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this.mozSrcObject;
          },
          set: function(stream) {
            this.mozSrcObject = stream;
          }
        });
      }
    }
  },

  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    if (typeof window !== 'object' || !(window.RTCPeerConnection ||
        window.mozRTCPeerConnection)) {
      return; // probably media.peerconnection.enabled=false in about:config
    }
    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        if (browserDetails.version < 38) {
          // .urls is not supported in FF < 38.
          // create RTCIceServers with a single url.
          if (pcConfig && pcConfig.iceServers) {
            var newIceServers = [];
            for (var i = 0; i < pcConfig.iceServers.length; i++) {
              var server = pcConfig.iceServers[i];
              if (server.hasOwnProperty('urls')) {
                for (var j = 0; j < server.urls.length; j++) {
                  var newServer = {
                    url: server.urls[j]
                  };
                  if (server.urls[j].indexOf('turn') === 0) {
                    newServer.username = server.username;
                    newServer.credential = server.credential;
                  }
                  newIceServers.push(newServer);
                }
              } else {
                newIceServers.push(pcConfig.iceServers[i]);
              }
            }
            pcConfig.iceServers = newIceServers;
          }
        }
        return new window.mozRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype =
          window.mozRTCPeerConnection.prototype;

      // wrap static methods. Currently just generateCertificate.
      if (window.mozRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return window.mozRTCPeerConnection.generateCertificate;
          }
        });
      }

      window.RTCSessionDescription = window.mozRTCSessionDescription;
      window.RTCIceCandidate = window.mozRTCIceCandidate;
    }

    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          window.RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };

    // shim getStats with maplike support
    var makeMapStats = function(stats) {
      var map = new Map();
      Object.keys(stats).forEach(function(key) {
        map.set(key, stats[key]);
        map[key] = stats[key];
      });
      return map;
    };

    var modernStatsTypes = {
      inboundrtp: 'inbound-rtp',
      outboundrtp: 'outbound-rtp',
      candidatepair: 'candidate-pair',
      localcandidate: 'local-candidate',
      remotecandidate: 'remote-candidate'
    };

    var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function(
      selector,
      onSucc,
      onErr
    ) {
      return nativeGetStats.apply(this, [selector || null])
        .then(function(stats) {
          if (browserDetails.version < 48) {
            stats = makeMapStats(stats);
          }
          if (browserDetails.version < 53 && !onSucc) {
            // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
              stats.forEach(function(stat) {
                stat.type = modernStatsTypes[stat.type] || stat.type;
              });
            } catch (e) {
              if (e.name !== 'TypeError') {
                throw e;
              }
              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
              stats.forEach(function(stat, i) {
                stats.set(i, Object.assign({}, stat, {
                  type: modernStatsTypes[stat.type] || stat.type
                }));
              });
            }
          }
          return stats;
        })
        .then(onSucc, onErr);
    };
  }
};

// Expose public methods.
module.exports = {
  shimOnTrack: firefoxShim.shimOnTrack,
  shimSourceObject: firefoxShim.shimSourceObject,
  shimPeerConnection: firefoxShim.shimPeerConnection,
  shimGetUserMedia: __webpack_require__(19)
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var utils = __webpack_require__(0);
var logging = utils.log;

// Expose public methods.
module.exports = function(window) {
  var browserDetails = utils.detectBrowser(window);
  var navigator = window && window.navigator;
  var MediaStreamTrack = window && window.MediaStreamTrack;

  var shimError_ = function(e) {
    return {
      name: {
        InternalError: 'NotReadableError',
        NotSupportedError: 'TypeError',
        PermissionDeniedError: 'NotAllowedError',
        SecurityError: 'NotAllowedError'
      }[e.name] || e.name,
      message: {
        'The operation is insecure.': 'The request is not allowed by the ' +
        'user agent or the platform in the current context.'
      }[e.message] || e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  // getUserMedia constraints shim.
  var getUserMedia_ = function(constraints, onSuccess, onError) {
    var constraintsToFF37_ = function(c) {
      if (typeof c !== 'object' || c.require) {
        return c;
      }
      var require = [];
      Object.keys(c).forEach(function(key) {
        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
          return;
        }
        var r = c[key] = (typeof c[key] === 'object') ?
            c[key] : {ideal: c[key]};
        if (r.min !== undefined ||
            r.max !== undefined || r.exact !== undefined) {
          require.push(key);
        }
        if (r.exact !== undefined) {
          if (typeof r.exact === 'number') {
            r. min = r.max = r.exact;
          } else {
            c[key] = r.exact;
          }
          delete r.exact;
        }
        if (r.ideal !== undefined) {
          c.advanced = c.advanced || [];
          var oc = {};
          if (typeof r.ideal === 'number') {
            oc[key] = {min: r.ideal, max: r.ideal};
          } else {
            oc[key] = r.ideal;
          }
          c.advanced.push(oc);
          delete r.ideal;
          if (!Object.keys(r).length) {
            delete c[key];
          }
        }
      });
      if (require.length) {
        c.require = require;
      }
      return c;
    };
    constraints = JSON.parse(JSON.stringify(constraints));
    if (browserDetails.version < 38) {
      logging('spec: ' + JSON.stringify(constraints));
      if (constraints.audio) {
        constraints.audio = constraintsToFF37_(constraints.audio);
      }
      if (constraints.video) {
        constraints.video = constraintsToFF37_(constraints.video);
      }
      logging('ff37: ' + JSON.stringify(constraints));
    }
    return navigator.mozGetUserMedia(constraints, onSuccess, function(e) {
      onError(shimError_(e));
    });
  };

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      getUserMedia_(constraints, resolve, reject);
    });
  };

  // Shim for mediaDevices on older versions.
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
      addEventListener: function() { },
      removeEventListener: function() { }
    };
  }
  navigator.mediaDevices.enumerateDevices =
      navigator.mediaDevices.enumerateDevices || function() {
        return new Promise(function(resolve) {
          var infos = [
            {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
            {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
          ];
          resolve(infos);
        });
      };

  if (browserDetails.version < 41) {
    // Work around http://bugzil.la/1169665
    var orgEnumerateDevices =
        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
    navigator.mediaDevices.enumerateDevices = function() {
      return orgEnumerateDevices().then(undefined, function(e) {
        if (e.name === 'NotFoundError') {
          return [];
        }
        throw e;
      });
    };
  }
  if (browserDetails.version < 49) {
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      return origGetUserMedia(c).then(function(stream) {
        // Work around https://bugzil.la/802326
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(function(track) {
            track.stop();
          });
          throw new DOMException('The object can not be found here.',
                                 'NotFoundError');
        }
        return stream;
      }, function(e) {
        return Promise.reject(shimError_(e));
      });
    };
  }
  if (!(browserDetails.version > 55 &&
      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    var remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      if (typeof c === 'object' && typeof c.audio === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }
      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        var obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === 'audio' && typeof c === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    if (browserDetails.version < 44) {
      return getUserMedia_(constraints, onSuccess, onError);
    }
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    console.warn('navigator.getUserMedia has been replaced by ' +
                 'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

var utils = __webpack_require__(0);

var safariShim = {
  // TODO: DrAlex, should be here, double check against LayoutTests

  // TODO: once the back-end for the mac port is done, add.
  // TODO: check for webkitGTK+
  // shimPeerConnection: function() { },

  shimLocalStreamsAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getLocalStreams = function() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
    }
    if (!('getStreamById' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getStreamById = function(id) {
        var result = null;
        if (this._localStreams) {
          this._localStreams.forEach(function(stream) {
            if (stream.id === id) {
              result = stream;
            }
          });
        }
        if (this._remoteStreams) {
          this._remoteStreams.forEach(function(stream) {
            if (stream.id === id) {
              result = stream;
            }
          });
        }
        return result;
      };
    }
    if (!('addStream' in window.RTCPeerConnection.prototype)) {
      var _addTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addStream = function(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        if (this._localStreams.indexOf(stream) === -1) {
          this._localStreams.push(stream);
        }
        var self = this;
        stream.getTracks().forEach(function(track) {
          _addTrack.call(self, track, stream);
        });
      };

      window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
        if (stream) {
          if (!this._localStreams) {
            this._localStreams = [stream];
          } else if (this._localStreams.indexOf(stream) === -1) {
            this._localStreams.push(stream);
          }
        }
        _addTrack.call(this, track, stream);
      };
    }
    if (!('removeStream' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.removeStream = function(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        var index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        var self = this;
        var tracks = stream.getTracks();
        this.getSenders().forEach(function(sender) {
          if (tracks.indexOf(sender.track) !== -1) {
            self.removeTrack(sender);
          }
        });
      };
    }
  },
  shimRemoteStreamsAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getRemoteStreams = function() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
    }
    if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
        get: function() {
          return this._onaddstream;
        },
        set: function(f) {
          if (this._onaddstream) {
            this.removeEventListener('addstream', this._onaddstream);
            this.removeEventListener('track', this._onaddstreampoly);
          }
          this.addEventListener('addstream', this._onaddstream = f);
          this.addEventListener('track', this._onaddstreampoly = function(e) {
            var stream = e.streams[0];
            if (!this._remoteStreams) {
              this._remoteStreams = [];
            }
            if (this._remoteStreams.indexOf(stream) >= 0) {
              return;
            }
            this._remoteStreams.push(stream);
            var event = new Event('addstream');
            event.stream = e.streams[0];
            this.dispatchEvent(event);
          }.bind(this));
        }
      });
    }
  },
  shimCallbacksAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    var prototype = window.RTCPeerConnection.prototype;
    var createOffer = prototype.createOffer;
    var createAnswer = prototype.createAnswer;
    var setLocalDescription = prototype.setLocalDescription;
    var setRemoteDescription = prototype.setRemoteDescription;
    var addIceCandidate = prototype.addIceCandidate;

    prototype.createOffer = function(successCallback, failureCallback) {
      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      var promise = createOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

    prototype.createAnswer = function(successCallback, failureCallback) {
      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      var promise = createAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

    var withCallback = function(description, successCallback, failureCallback) {
      var promise = setLocalDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;

    withCallback = function(description, successCallback, failureCallback) {
      var promise = setRemoteDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;

    withCallback = function(candidate, successCallback, failureCallback) {
      var promise = addIceCandidate.apply(this, [candidate]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
  },
  shimGetUserMedia: function(window) {
    var navigator = window && window.navigator;

    if (!navigator.getUserMedia) {
      if (navigator.webkitGetUserMedia) {
        navigator.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
      } else if (navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function(constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints)
          .then(cb, errcb);
        }.bind(navigator);
      }
    }
  },
  shimRTCIceServerUrls: function(window) {
    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
    var OrigPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        var newIceServers = [];
        for (var i = 0; i < pcConfig.iceServers.length; i++) {
          var server = pcConfig.iceServers[i];
          if (!server.hasOwnProperty('urls') &&
              server.hasOwnProperty('url')) {
            utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    // wrap static methods. Currently just generateCertificate.
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get: function() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
};

// Expose public methods.
module.exports = {
  shimCallbacksAPI: safariShim.shimCallbacksAPI,
  shimLocalStreamsAPI: safariShim.shimLocalStreamsAPI,
  shimRemoteStreamsAPI: safariShim.shimRemoteStreamsAPI,
  shimGetUserMedia: safariShim.shimGetUserMedia,
  shimRTCIceServerUrls: safariShim.shimRTCIceServerUrls
  // TODO
  // shimPeerConnection: safariShim.shimPeerConnection
};


/***/ }),
/* 21 */
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
/* 22 */
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
// CONCATENATED MODULE: ../node_modules/fetch-readablestream/src/xhr.js
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_original__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_original___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_original__);



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
    xhr.withCredentials = (options.credentials === 'include' || (options.credentials === 'same-origin' && __WEBPACK_IMPORTED_MODULE_1_original___default.a.same(url, location.origin)));
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parse = __webpack_require__(6);

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
/* 24 */
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
/* 25 */
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
  URL = URL || __webpack_require__(6);

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 26 */
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _detector = __webpack_require__(2);

var _detector2 = _interopRequireDefault(_detector);

var _cookies = __webpack_require__(4);

var _cookies2 = _interopRequireDefault(_cookies);

var _hooker = __webpack_require__(5);

var _hooker2 = _interopRequireDefault(_hooker);

var _faker = __webpack_require__(7);

var _faker2 = _interopRequireDefault(_faker);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            _faker2.default.fakeChrome();
        }
    }, {
        key: 'mockToUseM3u8',
        value: function mockToUseM3u8() {
            _faker2.default.fakeMacPlatform();
            _faker2.default.fakeSafari();
        }
    }, {
        key: 'mockForBestDefintion',
        value: function mockForBestDefintion() {
            // fall-back
            if (_detector2.default.isSupportVms()) {
                if (!_detector2.default.isChrome()) this.mockToUseVms(); // vms, 1080p or higher
            } else if (_detector2.default.isSupportM3u8()) {
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
            var _this = this;

            _hooker2.default.hookJqueryAjax(function (url, options) {
                if (_this._isAdReq(url)) {
                    var res = _faker2.default.fakeAdRes();
                    (options.complete || options.success)({ responseJSON: res }, 'success');
                    _logger2.default.log('mocked ad request ' + url);
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
            return !!_cookies2.default.get('P00001');
        }
    }, {
        key: 'mockVip',
        value: function mockVip() {
            var _this2 = this;

            if (!this._isLogin()) _faker2.default.fakePassportCookie();

            _hooker2.default.hookHttpJsonp(function (options) {
                var url = options.url;

                if (_this2._isCheckVipReq(url)) {
                    var res = _faker2.default.fakeVipRes(options.params.authcookie);
                    options.success(res);
                    _logger2.default.log('mocked check vip request ' + url);
                    return true;
                }
            });
        }
    }, {
        key: 'mockLogo',
        value: function mockLogo() {
            _hooker2.default.hookLogo(function (exports) {
                return exports.prototype.showLogo = function () {};
            });
        }
    }, {
        key: 'mockCheckPlugin',
        value: function mockCheckPlugin() {
            _hooker2.default.hookSkinBase(function (exports) {
                exports.prototype._checkPlugin = function () {};
            });
        }
    }]);

    return Mocker;
}();

exports.default = Mocker;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/* global define */

;(function ($) {
  'use strict'

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safeAdd (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRotateLeft (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5cmn (q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff (a, b, c, d, x, s, t) {
    return md5cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }
  function md5gg (a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }
  function md5hh (a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii (a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | (~d)), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binlMD5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32)
    x[(((len + 64) >>> 9) << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i
    var output = ''
    var length32 = input.length * 32
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    var length8 = input.length * 8
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstrMD5 (s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstrHMACMD5 (key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5C5C5C5C
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hexTab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hexTab.charAt((x >>> 4) & 0x0F) +
      hexTab.charAt(x & 0x0F)
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstrUTF8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function rawMD5 (s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  function hexMD5 (s) {
    return rstr2hex(rawMD5(s))
  }
  function rawHMACMD5 (k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  function hexHMACMD5 (k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }

  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return md5
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
}(this))


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _detector = __webpack_require__(2);

var _detector2 = _interopRequireDefault(_detector);

var _hooker = __webpack_require__(5);

var _hooker2 = _interopRequireDefault(_hooker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Patcher = function () {
    function Patcher() {
        _classCallCheck(this, Patcher);
    }

    _createClass(Patcher, null, [{
        key: '_patchWebFullScreen',
        value: function _patchWebFullScreen() {
            _hooker2.default.hookWebFullScreenInit(function (that, wrapper, btn) {
                btn.on('toggle', that.toggle.bind(that));
            });
        }
    }, {
        key: '_patchInitFullScreen',
        value: function _patchInitFullScreen() {
            this._patchWebFullScreen();

            _hooker2.default.hookInitFullScreen(function (that) {
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
        key: '_obtainFlvInfo',
        value: function _obtainFlvInfo() {
            var _this = this;

            _hooker2.default.hookParseData(function (that) {
                return _this._flvInfo = that.flvInfo;
            });
        }
    }, {
        key: '_patchCore',
        value: function _patchCore() {
            var self = this;

            this._patchPluginControls();
            this._patchInitFullScreen();
            this._obtainFlvInfo();

            _hooker2.default.hookCore(function (exports) {
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

                exports.prototype.seek = function () {
                    var _engine;

                    var video = this.video();
                    var playbackRate = video.playbackRate;
                    (_engine = this._engine).seek.apply(_engine, arguments);
                    video.playbackRate = playbackRate;
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
            _hooker2.default.hookPluginHotKeys(function (exports) {
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

                _logger2.default.log('添加键盘快捷键');
            });
        }
    }, {
        key: '_patchMouseShortcuts',
        value: function _patchMouseShortcuts() {
            _hooker2.default.hookPluginControlsInit(function (that) {
                document.addEventListener('wheel', function (event) {
                    if (!_detector2.default.isFullScreen()) return;

                    var delta = event.wheelDelta || event.detail || event.deltaY && -event.deltaY;
                    that.core.adjustVolume(delta > 0 ? 0.05 : -0.05);
                });

                _logger2.default.log('添加鼠标快捷键');
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

exports.default = Patcher;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.adaptIframe = exports.replaceFlash = undefined;

var _regenerator = __webpack_require__(31);

var _regenerator2 = _interopRequireDefault(_regenerator);

var embedSrc = function () {
    var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(targetNode, _ref2) {
        var tvid = _ref2.tvid,
            vid = _ref2.vid;
        var url;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        targetNode.innerHTML = '<div class="' + GM_info.script.name + ' info">\u6B63\u5728\u83B7\u53D6\u89C6\u9891\u6E90...</div>';

                        _context.prev = 1;
                        _context.next = 4;
                        return (0, _utils.getVideoUrl)(tvid, vid);

                    case 4:
                        url = _context.sent;

                        _logger2.default.log('source url: %s', url);
                        targetNode.innerHTML = '<iframe id="innerFrame" src="' + url + '" frameborder="0" allowfullscreen="true" width="100%" height="100%"></iframe>';
                        _context.next = 12;
                        break;

                    case 9:
                        _context.prev = 9;
                        _context.t0 = _context['catch'](1);

                        targetNode.innerHTML = '<div class="' + GM_info.script.name + ' error"><p>\u83B7\u53D6\u89C6\u9891\u6E90\u51FA\u9519\uFF01</p><p>' + _context.t0.message + '</p></div>';

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[1, 9]]);
    }));

    return function embedSrc(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _hooker = __webpack_require__(5);

var _hooker2 = _interopRequireDefault(_hooker);

var _faker = __webpack_require__(7);

var _faker2 = _interopRequireDefault(_faker);

var _detector = __webpack_require__(2);

var _detector2 = _interopRequireDefault(_detector);

var _utils = __webpack_require__(34);

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
                        _logger2.default.log('finded node', node);

                        var text = node.outerHTML;
                        var vid = (0, _utils.findVid)(text);
                        var tvid = (0, _utils.findTvid)(text);

                        if (tvid && vid) {
                            _logger2.default.log('finded tvid: %s, vid: %s', tvid, vid);
                            embedSrc(node.parentNode, { tvid: tvid, vid: vid });
                            self.disconnect();
                            _logger2.default.log('stoped observation');
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
    _logger2.default.log('started observation');
}

function adaptIframe() {
    var style = '\n        body[class|="qypage"] {\n            overflow: hidden !important;\n            background: #000 !important;\n            visibility: hidden;\n        }\n\n        .mod-func {\n            display: none !important;\n        }\n\n        .' + GM_info.script.name + '.info {\n            width: 20em;\n            height: 5em;\n            position: absolute;\n            top: 0;\n            bottom: 0;\n            left: 0;\n            right: 0;\n            margin: auto;\n            text-align: center;\n            line-height: 5em;\n            font-size: 1em;\n            color: #ccc;\n        }\n\n        .' + GM_info.script.name + '.error {\n            height: 3em;\n            position: absolute;\n            top: 0;\n            bottom: 0;\n            left: 0;\n            right: 0;\n            margin: auto;\n            text-align: center;\n            font-size: 1em;\n            color: #c00;\n        }\n    ';

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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(32);


/***/ }),
/* 32 */
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

module.exports = __webpack_require__(33);

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 33 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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

/***/ })
/******/ ]);