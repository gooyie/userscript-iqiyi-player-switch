import Logger from './logger';
import Hooker from './hooker';
import { fullscreen } from './fullscreen';
import { webFullscreen } from './web-fullscreen';
import { flvInfo } from './parsed-data';

class Patch {
    constructor() {
        this._installed = false;
    }

    install() {
        if (!this._installed) {
            this._installed = true;
            this._prepare();
            this._apply();
        }
    }

    _prepare() {}

    _apply() {}
}

class VipPatch extends Patch {
    constructor() {
        super();
    }

    _apply() {
        Hooker.hookUser((exports) => {
            const proto = exports.__proto__;
            proto.isVipSync = () => true;
            proto.isVip = (cb) => setTimeout(cb, 0, true);
            Logger.info('vip 补丁已安装');
        });
    }
}

class AdsPatch extends Patch {
    constructor() {
        super();
    }

    _fakeAdsData() {
        return {};
    }

    _apply() {
        Hooker.hookShowRequest((exports) => {
            const proto = exports.prototype;
            proto.request = (cb) => setTimeout(cb, 0, this._fakeAdsData());
            Logger.info('和谐广告补丁已安装');
        });
    }
}

class WatermarksPatch extends Patch {
    constructor() {
        super();
    }

    _apply() {
        Hooker.hookLogo((exports) => {
            exports.prototype.showLogo = () => {};
            Logger.info('和谐水印补丁已安装');
        });
    }
}

class CheckPluginPatch extends Patch {
    constructor() {
        super();
    }

    _apply() {
        Hooker.hookSkinBase((exports) => {
            exports.prototype._checkPlugin = () => {};
            Logger.info('阻止插件检测补丁已安装');
        });
    }
}

class CorePatch extends Patch {
    constructor() {
        super();
    }

    _prepare() {
        Hooker.hookPluginControlsInit((that) => {
            that.core.on('showtip', (event) => {
                that.setcontroltip.apply(that, [{str: event.data, x: that._process.offset().left, y: 3, cut: true, timeout: true}]);
                if (that.$plugin.hasClass('process_hidden')) {
                    that._controltips.css('top', '-25px');
                } else if (that.$plugin.hasClass('bottom-hide')) {
                    that._controltips.css('top', '-38px');
                }
            });
        });
    }

    _apply() {
        Hooker.hookCore((exports) => {
            const proto = exports.prototype;

            proto._showTip = function(msg) {
                this.fire({type: 'showtip', data: msg});
            };

            proto.getFPS = function() {
                if (flvInfo) {
                    return flvInfo.videoConfigTag.sps.frame_rate.fps;
                } else {
                    return 25; // f4v极速以上，动画23.976、电影24、电视剧25。
                }
            };

            proto.prevFrame = function() {
                const video = this.video();
                const seekTime = Math.max(0, Math.min(this.getDuration(), video.currentTime - 1 / this.getFPS()));
                video.currentTime = seekTime;
                this._showTip('上一帧');
            };

            proto.nextFrame = function() {
                const video = this.video();
                const seekTime = Math.max(0, Math.min(this.getDuration(), video.currentTime + 1 / this.getFPS()));
                video.currentTime = seekTime;
                this._showTip('下一帧');
            };

            proto.seek = function(...args) {
                const video = this.video();
                const playbackRate = video.playbackRate;
                this._engine.seek(...args);
                video.playbackRate = playbackRate;
            };

            proto.stepSeek = function(stepTime) {
                const seekTime = Math.max(0, Math.min(this.getDuration(), this.getCurrenttime() + stepTime));
                let msg;

                if (Math.abs(stepTime) < 60) {
                    msg = stepTime > 0 ? `步进：${stepTime}秒` : `步退：${Math.abs(stepTime)}秒`;
                } else {
                    msg = stepTime > 0 ? `步进：${stepTime/60}分钟` : `步退：${Math.abs(stepTime)/60}分钟`;
                }
                this._showTip(msg);

                this.seek(seekTime, true);
            };

            proto.rangeSeek = function(range) {
                const duration = this.getDuration();
                const seekTime = Math.max(0, Math.min(duration, duration * range));
                this.seek(seekTime, true);
                this._showTip('定位：' + (range * 100).toFixed(0) + '%');
            };

            proto.toggleMute = function() {
                if (this.getMuted()) {
                    this.setMuted(false);
                    this._showTip('取消静音');
                } else {
                    this.setMuted(true);
                    this._showTip('静音');
                }
            };

            proto.adjustVolume = function(value) {
                let volume = this.getVolume() + value;
                volume = Math.max(0, Math.min(1, volume.toFixed(2)));
                this.setVolume(volume);
                this.fire({type: 'keyvolumechange'});
            };

            proto.adjustPlaybackRate = function(value) {
                const video = this.video();
                const playbackRate = Math.max(0.2, Math.min(5, video.playbackRate + value));
                video.playbackRate = playbackRate;
                this._showTip(`播放速率：${playbackRate.toFixed(1).replace(/\.0+$/, '')}`);
            };

            proto.resetPlaybackRate = function() {
                const video = this.video();
                video.playbackRate = 1;
                this._showTip('恢复播放速率');
            };

            proto.hasPrevVideo = function() {
                return this._getVideoIndexInList(this._movieinfo.tvid) > 0 || this._getVideoIndexInList(this._movieinfo.oldTvid) > 0;
            };

            proto.playNext = function() {
                if (this.hasNextVideo()) {
                    this._showTip('播放下一集');
                    this.switchNextVideo();
                } else {
                    this._showTip('没有下一集哦');
                }
            };

            proto.playPrev = function() {
                if (this.hasPrevVideo()) {
                    this._showTip('播放上一集');
                    this.switchPreVideo();
                } else {
                    this._showTip('没有上一集哦');
                }
            };

            Logger.info('core 补丁已安装');
        });
    }
}

const corePatch = new CorePatch();

class KeyShortcutsPatch extends Patch {
    constructor() {
        super();
    }

    _prepare() {
        corePatch.install();
    }

    _apply() {
        Hooker.hookPluginHotKeys((exports) => {
            const proto = exports.prototype;

            proto.init = function() {
                document.addEventListener('keydown', this._keydown.bind(this));
            };

            proto._isValidTarget = function(target) {
                return target.nodeName === 'BODY' || target.nodeName == 'VIDEO' || target.classList.contains('pw-video'); // 全局
                // return target.nodeName === 'VIDEO' || target.classList.contains('pw-video'); // 非全局
            };

            proto._keydown = function(event) {
                if (!this._isValidTarget(event.target)) return;

                const { keyCode, ctrlKey, shiftKey, altKey } = event;
                const core = this.core;

                switch (keyCode) {
                case 32: // Spacebar
                    if (!ctrlKey && !shiftKey && !altKey) {
                        if (core.isPaused()) {
                            core.play(true);
                            core._showTip('播放');
                        } else {
                            core.pause(true);
                            core._showTip('暂停');
                        }
                    } else {
                        return;
                    }
                    break;
                case 39:    // → Arrow Right
                case 37: {  // ← Arrow Left
                    let stepTime;
                    if (!ctrlKey && !shiftKey && !altKey) {
                        stepTime = 39 === keyCode ? 5 : -5;
                    } else if (ctrlKey && !shiftKey && !altKey) {
                        stepTime = 39 === keyCode ? 30 : -30;
                    } else if (!ctrlKey && shiftKey && !altKey) {
                        stepTime = 39 === keyCode ? 60 : -60;
                    } else if (ctrlKey && !shiftKey && altKey) {
                        stepTime = 39 === keyCode ? 3e2 : -3e2; // 5分钟
                    } else {
                        return;
                    }

                    core.stepSeek(stepTime);
                    break;
                }
                case 38: // ↑ Arrow Up
                case 40: // ↓ Arrow Down
                    if (!ctrlKey && !shiftKey && !altKey) {
                        core.adjustVolume(38 === keyCode ? 0.05 : -0.05);
                    } else {
                        return;
                    }
                    break;
                case 77: // M
                    if (!ctrlKey && !shiftKey && !altKey) {
                        core.toggleMute();
                    } else {
                        return;
                    }
                    break;
                case 13: // Enter
                    if (!ctrlKey && !shiftKey && !altKey) {
                        fullscreen.toggle();
                    } else if (ctrlKey && !shiftKey && !altKey) {
                        webFullscreen.toggle();
                    } else {
                        return;
                    }
                    break;
                case 67: // C
                case 88: // X
                    if (!ctrlKey && !shiftKey && !altKey) {
                        core.adjustPlaybackRate(67 === keyCode ? 0.1 : -0.1);
                    } else {
                        return;
                    }
                    break;
                case 90: // Z
                    if (!ctrlKey && !shiftKey && !altKey) {
                        core.resetPlaybackRate();
                    } else {
                        return;
                    }
                    break;
                case 68: // D
                case 70: // F
                    if (!ctrlKey && !shiftKey && !altKey) {
                        core.pause(true);
                        if (keyCode === 68) {
                            core.prevFrame();
                        } else {
                            core.nextFrame();
                        }
                    } else {
                        return;
                    }
                    break;
                case 80: // P
                case 78: // N
                    if (!ctrlKey && shiftKey && !altKey) {
                        if (keyCode === 78) {
                            core.playNext();
                        } else {
                            core.playPrev();
                        }
                    } else {
                        return;
                    }
                    break;
                case 27: // ESC
                    if (!event.ctrlKey && !event.shiftKey && !event.altKey)
                        webFullscreen.isWebFullScreen() && webFullscreen.exit();
                    return;
                default:
                    if (keyCode >= 48 && keyCode <= 57) { // 0 ~ 9
                        if (!ctrlKey && !shiftKey && !altKey) {
                            core.rangeSeek((keyCode - 48) * 0.1);
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

            Logger.info('键盘快捷键已添加');
        });
    }
}

class MouseShortcutsPatch extends Patch {
    constructor() {
        super();
    }

    _prepare() {
        corePatch.install();
    }

    _apply() {
        Hooker.hookDefaultSkin((exports) => {
            exports.prototype._initDBClicks = function() {
                let timer, core = this.core;
                this.videoWrapper.find('video').on('click', () => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                        return;
                    }
                    timer = setTimeout(() => {
                        if (core.isPaused()) {
                            core.play(true);
                        } else {
                            core.pause(true);
                        }
                        timer = null;
                    }, 200);
                }).on('dblclick', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.ctrlKey) {
                        webFullscreen.toggle();
                    } else {
                        fullscreen.toggle();
                    }
                }).on('wheel', (event) => {
                    if (fullscreen.isFullScreen() || webFullscreen.isWebFullScreen()) {
                        const delta = event.wheelDelta || event.detail || (event.deltaY && -event.deltaY);
                        core.adjustVolume(delta > 0 ? 0.05 : -0.05);
                    }
                });
            };

            Logger.info('鼠标快捷键已添加');
        });
    }
}

export const vipPatch = new VipPatch();
export const adsPatch = new AdsPatch();
export const watermarksPatch = new WatermarksPatch();
export const checkPluginPatch = new CheckPluginPatch();
export const keyShortcutsPatch = new KeyShortcutsPatch();
export const mouseShortcutsPatch = new MouseShortcutsPatch();
