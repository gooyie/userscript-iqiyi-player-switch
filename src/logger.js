/* eslint-disable no-console */
class Logger {

    constructor(tag) {
        this._tag = tag;
    }

    get tag() {
        return this._tag;
    }

    log(...args) {
        console.log('%c' + this.tag + '%c' + args.shift(),
            'color: green; font-weight: bolder', 'color: blue', ...args);
    }

    info(...args) {
        console.info(this.tag + args.shift(), ...args);
    }

    debug(...args) {
        console.debug(this.tag + args.shift(), ...args);
    }

    warn(...args) {
        console.warn(this.tag + args.shift(), ...args);
    }

    error(...args) {
        console.error(this.tag + args.shift(), ...args);
    }

}

export default new Logger(`[${GM_info.script.name}]`);
