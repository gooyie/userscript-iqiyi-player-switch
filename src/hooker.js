import Logger from './logger';

class Hooker {
    static _hookCall(cb) {
        const call = Function.prototype.call;
        Function.prototype.call = function(...args) {
            let ret = call.apply(this, args);
            try {
                if (args && cb(args)) {
                    Function.prototype.call = call;
                    cb = () => {};
                    Logger.info(`The native function call has been restored`);
                }
            } catch (err) {
                Logger.error(err.stack);
            }
            return ret;
        };
        this._hookCall = null;
    }

    static _isModuleCall(args) { // module.exports, module, module.exports, require
        return args.length === 4 && args[1] && Object.getPrototypeOf(args[1]) === Object.prototype && args[1].hasOwnProperty('exports');
    }

    static _hookModuleCall(cb, pred) {
        const callbacksMap = new Map([[pred, [cb]]]);
        this._hookCall((args) => {
            if (!this._isModuleCall(args)) return;

            const exports = args[1].exports;
            for (const [pred, callbacks] of callbacksMap) {
                if (!pred.apply(this, [exports])) continue;
                callbacks.forEach(cb => cb(exports, args));
                this.keepalive || callbacksMap.delete(pred);
                !callbacksMap.size && (this._hookModuleCall = null);
                break;
            }

            return !callbacksMap.size;
        });

        this._hookModuleCall = (cb, pred) => {
            if (callbacksMap.has(pred)) {
                callbacksMap.get(pred).push(cb);
            } else {
                callbacksMap.set(pred, [cb]);
            }
        };
    }

    static _isJqueryModuleCall(exports) {
        return exports.hasOwnProperty('fn') && exports.fn.hasOwnProperty('jquery');
    }

    static hookJquery(cb = ()=>{}) {
        this._hookModuleCall(cb, this._isJqueryModuleCall);
    }

    static hookJqueryAjax(cb) {
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

    static _isHttpModuleCall(exports) {
        return exports.hasOwnProperty('jsonp') && exports.hasOwnProperty('ajax');
    }

    static hookHttp(cb) {
        this._hookModuleCall(cb, this._isHttpModuleCall);
    }

    static hookHttpJsonp(cb) {
        this.hookHttp((exports) => {
            const jsonp = exports.jsonp.bind(exports);
            exports.jsonp = function(options) {
                let isHijacked = cb(options);
                if (isHijacked) return;
                return jsonp(options);
            };
        });
    }

    static _isLogoModuleCall(exports) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('showLogo');
    }

    static hookLogo(cb) {
        this._hookModuleCall(cb, this._isLogoModuleCall);
    }

    static _isFullScreenModuleCall(exports) {
        return exports.__proto__ && exports.__proto__.hasOwnProperty('isFullScreen');
    }

    static hookFullScreen(cb) {
        this._hookModuleCall(cb, this._isFullScreenModuleCall);
    }

    static _isWebFullScreenModuleCall(exports) {
        return exports.__proto__ && exports.__proto__.hasOwnProperty('isWebFullScreen');
    }

    static hookWebFullScreen(cb) {
        this._hookModuleCall(cb, this._isWebFullScreenModuleCall);
    }

    static hookWebFullScreenInit(cb) {
        this.hookWebFullScreen((exports) => {
            const init = exports.__proto__.init;
            exports.__proto__.init = function(wrapper, btn) {
                cb(this, wrapper, btn);
                init.apply(this, [wrapper, btn]);
            };
        });
    }

    static _isPluginControlsModuleCall(exports) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('initFullScreen');
    }

    static hookPluginControls(cb) {
        this._hookModuleCall(cb, this._isPluginControlsModuleCall);
    }

    static hookPluginControlsInit(cb) {
        this.hookPluginControls((exports) => {
            const init = exports.prototype.init;
            exports.prototype.init = function() {
                cb(this);
                init.apply(this);
            };
        });
    }

    static hookInitFullScreen(cb) {
        this.hookPluginControls((exports) => {
            const initFullScreen = exports.prototype.initFullScreen;
            exports.prototype.initFullScreen = function() {
                cb(this);
                initFullScreen.apply(this);
            };
        });
    }

    static _isCoreModuleCall(exports) {
        return 'function' === typeof exports &&
                exports.prototype.hasOwnProperty('getdefaultvds') &&
                exports.prototype.hasOwnProperty('getMovieInfo');
    }

    static hookCore(cb) {
        this._hookModuleCall(cb, this._isCoreModuleCall);
    }

    static _isSkinBaseModuleCall(exports) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('_checkPlugin');
    }

    static hookSkinBase(cb) {
        this._hookModuleCall(cb, this._isSkinBaseModuleCall);
    }

    static _isPluginHotKeysModuleCall(exports) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('_keydown');
    }

    static hookPluginHotKeys(cb) {
        this._hookModuleCall(cb, this._isPluginHotKeysModuleCall);
    }

    static _isFragmentModuleCall(exports) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('parseData');
    }

    static hookFragment(cb) {
        this._hookModuleCall(cb, this._isFragmentModuleCall);
    }

    static hookParseData(cb) {
        this.hookFragment((exports) => {
            const parseData = exports.prototype.parseData;
            exports.prototype.parseData = function(...args) {
                parseData.apply(this, args);
                cb(this);
            };
        });
    }

    static _isUserModuleCall(exports) {
        return exports.__proto__ && exports.__proto__.hasOwnProperty('isVip');
    }

    static hookUser(cb) {
        this._hookModuleCall(cb, this._isUserModuleCall);
    }

    static _isShowRequestModuleCall(exports) {
        return 'function' === typeof exports && exports.compressRequestKey && exports.prototype.hasOwnProperty('request');
    }

    static hookShowRequest(cb) {
        this._hookModuleCall(cb, this._isShowRequestModuleCall);
    }

    static _isDefaultSkinModuleCall(exports) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('_initDBClicks');
    }

    static hookDefaultSkin(cb) {
        this._hookModuleCall(cb, this._isDefaultSkinModuleCall);
    }

    static _isConfigModuleCall(exports) {
        return exports.loadType && exports.dispatchCfg;
    }

    static hookConfig(cb) {
        this._hookModuleCall(cb, this._isConfigModuleCall);
    }
}

Hooker.keepalive = false;

export default Hooker;
