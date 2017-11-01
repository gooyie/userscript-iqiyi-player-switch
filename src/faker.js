// import Logger from './logger';
// import Cookies from './cookies';
// import md5 from 'blueimp-md5';

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
}

export default Faker;
