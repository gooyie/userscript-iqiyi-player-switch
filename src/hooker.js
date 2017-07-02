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

export default Hooker;
