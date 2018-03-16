import Logger from './logger';
import Cookies from './cookies';
import Detector from './detector';
import Faker from './faker';
import { replaceFlash, adaptIframe } from './outsite';
import {
    vipPatch,
    adsPatch,
    controlsPatch,
    watermarksPatch,
    keepHookingPatch,
    keyShortcutsPatch,
    mouseShortcutsPatch,
    useWebSocketLoaderPatch,
} from './patch';

const PLAYER_TYPE = {
    Html5VOD: 'h5_VOD',
    FlashVOD: 'flash_VOD'
};

function forceHtml5() {
    Cookies.set('player_forcedType', PLAYER_TYPE.Html5VOD, {domain: '.iqiyi.com'});
    Logger.info(`The 'player_forcedType' cookie has been set as '${PLAYER_TYPE.Html5VOD}'`);
}

function forceFlash() {
    Cookies.set('player_forcedType', PLAYER_TYPE.FlashVOD, {domain: '.iqiyi.com'});
    Logger.info(`The 'player_forcedType' cookie has been set as '${PLAYER_TYPE.FlashVOD}'`);
}

function clean() {
    Cookies.remove('player_forcedType', {domain: '.iqiyi.com'});
    Logger.info(`Removed the 'player_forcedType' cookie`);
}

function switchTo(type) {
    Logger.info(`Switching to ${type} ...`);
    GM_setValue('player_forcedType', type);
    document.location.reload();
}

function registerMenu() {
    const MENU_NAME = {
        HTML5: 'HTML5播放器',
        FLASH: 'Flash播放器'
    };

    let currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD); // 默认为Html5播放器，免去切换。
    let [type, name] = currType === PLAYER_TYPE.Html5VOD ? [PLAYER_TYPE.FlashVOD, MENU_NAME.FLASH] : [PLAYER_TYPE.Html5VOD, MENU_NAME.HTML5];
    GM_registerMenuCommand(name, () => switchTo(type), null);
    Logger.info(`Registered the menu.`);
}

function mustKeepHooking() {
    return location.search.includes('list'); // https://github.com/gooyie/userscript-iqiyi-player-switch/issues/15
}

//=============================================================================

registerMenu();

let currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD);
if (currType === PLAYER_TYPE.Html5VOD) {
    if (Detector.isSupportHtml5()) {
        if (Detector.isOutsite()) {
            replaceFlash();
        } else {
            forceHtml5();

            if (Detector.isFirefox()) {
                // Fake Chrome with a version number less than 43
                // to use the data engine to play videos better than HD and to use the XHR loader
                // because Firefox has not yet implemented ReadableStream to support the Fetch loader.
                Faker.fakeChrome(42);
            }

            if (mustKeepHooking()) {
                keepHookingPatch.install();
            }
            adsPatch.install();
            controlsPatch.install();
            watermarksPatch.install();
            vipPatch.install();
            keyShortcutsPatch.install();
            mouseShortcutsPatch.install();
            useWebSocketLoaderPatch.install();

            if (Detector.isInIFrame() && Detector.isOutsideLink()) {
                adaptIframe();
            }
        }
    } else {
        alert('╮(╯▽╰)╭ 你的浏览器播放不了html5视频~~~~');
    }
} else {
    forceFlash();
}

window.addEventListener('unload', () => clean());
