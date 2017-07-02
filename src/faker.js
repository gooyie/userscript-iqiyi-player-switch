import Logger from './logger';
import Cookies from './cookies';
import md5 from 'blueimp-md5';

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

export default Faker;
