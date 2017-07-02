import './polyfill';
import Logger from './logger';
import Cookies from './cookies';
import Detector from './detector';
import Mocker from './mocker';
import Patcher from './patcher';
import { replaceFlash, adaptIframe } from './outsite';

const PLAYER_TYPE = {
    Html5VOD: 'h5_VOD',
    FlashVOD: 'flash_VOD'
};

function forceHtml5() {
    Logger.log(`setting player_forcedType cookie as ${PLAYER_TYPE.Html5VOD}`);
    Cookies.set('player_forcedType', PLAYER_TYPE.Html5VOD, {domain: '.iqiyi.com'});
}

function forceFlash() {
    Logger.log(`setting player_forcedType cookie as ${PLAYER_TYPE.FlashVOD}`);
    Cookies.set('player_forcedType', PLAYER_TYPE.FlashVOD, {domain: '.iqiyi.com'});
}

function clean() {
    Cookies.remove('player_forcedType', {domain: '.iqiyi.com'});
    if (Cookies.get('P00001') === 'faked_passport') Cookies.remove('P00001', {domain: '.iqiyi.com'});
    Logger.log(`removed cookies.`);
}

function switchTo(toType) {
    Logger.log(`switching to ${toType} ...`);

    GM_setValue('player_forcedType', toType);
    document.location.reload();
}

function registerMenu() {
    const MENU_NAME = {
        HTML5: 'HTML5播放器',
        FLASH: 'Flash播放器'
    };

    let currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD); // 默认为Html5播放器，免去切换。
    let [toType, name] = currType === PLAYER_TYPE.Html5VOD ? [PLAYER_TYPE.FlashVOD, MENU_NAME.FLASH] : [PLAYER_TYPE.Html5VOD, MENU_NAME.HTML5];
    GM_registerMenuCommand(name, () => switchTo(toType), null);
    Logger.log(`registered menu.`);
}

//=============================================================================

registerMenu();

let currType = GM_getValue('player_forcedType', PLAYER_TYPE.Html5VOD);
if (currType === PLAYER_TYPE.Html5VOD) {
    if (Detector.isSupportHtml5()) {
        forceHtml5();
        Mocker.mock();
        Patcher.patchShortcuts();

        if (Detector.isInnerFrame()) adaptIframe();
        if (Detector.isOutsite()) replaceFlash();
    } else {
        alert('╮(╯▽╰)╭ 你的浏览器播放不了html5视频~~~~');
    }
} else {
    forceFlash();
}

window.addEventListener('unload', () => clean());
