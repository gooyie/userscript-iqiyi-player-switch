import Logger from './logger';

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

    static _isModuleCall(args) { // module.exports, module, module.exports, require
        return args.length === 4 && args[1] instanceof Object && args[1].hasOwnProperty('exports');
    }

    static hookModuleCall(cb = ()=>{}) {
        this.hookCall((...args) => {if (this._isModuleCall(args)) cb(...args);});
    }

    static _isJqueryModuleCall(exports) {
        return exports.hasOwnProperty('fn') && exports.fn.hasOwnProperty('jquery');
    }

    static hookJquery(cb = ()=>{}) {
        this.hookModuleCall((...args) => {if (this._isJqueryModuleCall(args[1].exports)) cb(args[1].exports);});
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

    static _isHttpModuleCall(exports = {}) {
        return exports.hasOwnProperty('jsonp') && exports.hasOwnProperty('ajax');
    }

    static hookHttp(cb = ()=>{}) {
        this.hookModuleCall((...args) => {if (this._isHttpModuleCall(args[1].exports)) cb(args[1].exports);});
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

    static _isLogoModuleCall(exports = {}) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('showLogo');
    }

    static hookLogo(cb = ()=>{}) {
        this.hookModuleCall((...args) => {if (this._isLogoModuleCall(args[1].exports)) cb(args[1].exports);});
    }

    static _isFullScreenModuleCall(exports = {}) {
        return exports.__proto__ && exports.__proto__.hasOwnProperty('isFullScreen');
    }

    static hookFullScreen(cb = ()=>{}) {
        this.hookModuleCall((...args) => {if (this._isFullScreenModuleCall(args[1].exports)) cb(args[1].exports);});
    }

    static _isWebFullScreenModuleCall(exports = {}) {
        return exports.__proto__ && exports.__proto__.hasOwnProperty('isWebFullScreen');
    }

    static hookWebFullScreen(cb = ()=>{}) {
        this.hookModuleCall((...args) => {if (this._isWebFullScreenModuleCall(args[1].exports)) cb(args[1].exports);});
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

    static _isPluginControlsModuleCall(exports = {}) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('initFullScreen');
    }

    static hookPluginControls(cb = ()=>{}) {
        this.hookModuleCall((...args) => {if (this._isPluginControlsModuleCall(args[1].exports)) cb(args[1].exports);});
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

    static _isCoreModuleCall(exports = {}) {
        return 'function' === typeof exports &&
                exports.prototype.hasOwnProperty('getdefaultvds') &&
                exports.prototype.hasOwnProperty('getMovieInfo');
    }

    static hookCore(cb = ()=>{}) {
        this.hookModuleCall((...args) => {if (this._isCoreModuleCall(args[1].exports)) cb(args[1].exports);});
    }

    static _isSkinBaseModuleCall(exports = {}) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('_checkPlugin');
    }

    static hookSkinBase(cb = ()=>{}) {
        this.hookModuleCall((...args) => {if (this._isSkinBaseModuleCall(args[1].exports)) cb(args[1].exports);});
    }

    static _isPluginHotKeysModuleCall(exports = {}) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('_keydown');
    }

    static hookPluginHotKeys(cb = ()=>{}) {
        this.hookModuleCall((...args) => {if (this._isPluginHotKeysModuleCall(args[1].exports)) cb(args[1].exports);});
    }

    static _isFragmentModuleCall(exports = {}) {
        return 'function' === typeof exports && exports.prototype.hasOwnProperty('parseData');
    }

    static hookFragment(cb = ()=>{}) {
        this.hookModuleCall((...args) => {if (this._isFragmentModuleCall(args[1].exports)) cb(args[1].exports);});
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

export default Hooker;
