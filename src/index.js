import './polyfill';
import Logger from './logger';
import Cookies from './cookies';
import Detector from './detector';
import Hooker from './hooker';
import Faker from './faker';
import { replaceFlash, adaptIframe } from './outsite';
import {
    vipPatch,
    adsPatch,
    watermarksPatch,
    checkPluginPatch,
    keyShortcutsPatch,
    mouseShortcutsPatch,
    useWebSocketLoaderPatch,
} from './patch';

const PLAYER_TYPE = {
    Html5VOD: 'h5_VOD',
    FlashVOD: 'flash_VOD'
};

function forceHtml5() {
    Logger.info(`setting player_forcedType cookie as ${PLAYER_TYPE.Html5VOD}`);
    Cookies.set('player_forcedType', PLAYER_TYPE.Html5VOD, {domain: '.iqiyi.com'});
}

function forceFlash() {
    Logger.info(`setting player_forcedType cookie as ${PLAYER_TYPE.FlashVOD}`);
    Cookies.set('player_forcedType', PLAYER_TYPE.FlashVOD, {domain: '.iqiyi.com'});
}

function clean() {
    Cookies.remove('player_forcedType', {domain: '.iqiyi.com'});
    Logger.info(`removed cookies.`);
}

function switchTo(toType) {
    Logger.info(`switching to ${toType} ...`);

    GM_setValue('player_forcedType', toType);
    document.location.reload();
}

function autoFallback() {
    if (Detector.isSupportVms()) { // vms f4v(flv)
        if (!Detector.isChrome()) {
            Faker.fakeChrome();
        }
    } else if (Detector.isSupportM3u8()) { // tmts m3u8
        Faker.fakeMacPlatform();
        Faker.fakeSafari();
    } else {
        // by default, tmts mp4 ...
    }
}

function registerMenu() {
    const MENU_NAME = {
        HTML5: 'HTML5播放器',
        FLASH: 'Flash播放器'
    };

    let currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD); // 默认为Html5播放器，免去切换。
    let [toType, name] = currType === PLAYER_TYPE.Html5VOD ? [PLAYER_TYPE.FlashVOD, MENU_NAME.FLASH] : [PLAYER_TYPE.Html5VOD, MENU_NAME.HTML5];
    GM_registerMenuCommand(name, () => switchTo(toType), null);
    Logger.info(`registered menu.`);
}

//=============================================================================

registerMenu();

let currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD);
if (currType === PLAYER_TYPE.Html5VOD) {
    if (Detector.isSupportHtml5()) {
        if (Detector.isOutsite()) {
            replaceFlash();
        } else {
            if (location.search.includes('list')) {
                Hooker.keepalive = true;
                Logger.info('keepalive hooks');
            }

            forceHtml5();
            autoFallback();

            adsPatch.install();
            watermarksPatch.install();
            vipPatch.install();
            checkPluginPatch.install();
            keyShortcutsPatch.install();
            mouseShortcutsPatch.install();
            useWebSocketLoaderPatch.install();

            if (Detector.isInnerFrame()) adaptIframe();
        }
    } else {
        alert('╮(╯▽╰)╭ 你的浏览器播放不了html5视频~~~~');
    }
} else {
    forceFlash();
}

window.addEventListener('unload', () => clean());
