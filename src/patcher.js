import Logger from './logger';
import Detector from './detector';
import Hooker from './hooker';

class Patcher {

    static _patchWebFullScreen() {
        Hooker.hookWebFullScreenInit((that, wrapper, btn) => {
            btn.on('toggle', that.toggle.bind(that));
        });
    }

    static _patchInitFullScreen() {
        this._patchWebFullScreen();

        Hooker.hookInitFullScreen((that) => {
            that.core.on('togglefullscreen', () => {
                that._fullscreenBtn.fire('click', {data: null});
            });

            that.core.on('togglewebfullscreen', () => {
                that._webfullscreenBtn.fire('toggle',  {data: null});
            });
        });
    }

    static _patchPluginControls() {
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

    static _obtainFlvInfo() {
        Hooker.hookParseData(that => this._flvInfo = that.flvInfo);
    }

    static _patchCore() {
        const self = this;

        this._patchPluginControls();
        this._patchInitFullScreen();
        this._obtainFlvInfo();

        Hooker.hookCore((exports) => {
            exports.prototype._showTip = function(msg) {
                this.fire({type: 'showtip', data: msg});
            };

            exports.prototype.getFPS = function() {
                if (self._flvInfo) {
                    return self._flvInfo.videoConfigTag.sps.frame_rate.fps;
                } else {
                    return 25; // f4v极速以上，动画23.976、电影24、电视剧25。
                }
            };

            exports.prototype.previousFrame = function() {
                const video = this.video();
                let seekTime = Math.max(0, Math.min(this.getDuration(), video.currentTime - 1 / this.getFPS()));
                video.currentTime = seekTime;
                this._showTip('上一帧');
            };

            exports.prototype.nextFrame = function() {
                const video = this.video();
                let seekTime = Math.max(0, Math.min(this.getDuration(), video.currentTime + 1 / this.getFPS()));
                video.currentTime = seekTime;
                this._showTip('下一帧');
            };

            exports.prototype.seek = function(...args) {
                const video = this.video();
                const playbackRate = video.playbackRate;
                this._engine.seek(...args);
                video.playbackRate = playbackRate;
            };

            exports.prototype.stepSeek = function(stepTime) {
                let seekTime = Math.max(0, Math.min(this.getDuration(), this.getCurrenttime() + stepTime));
                let msg;

                if (Math.abs(stepTime) < 60) {
                    msg = stepTime > 0 ? `步进：${stepTime}秒` : `步退：${Math.abs(stepTime)}秒`;
                } else {
                    msg = stepTime > 0 ? `步进：${stepTime/60}分钟` : `步退：${Math.abs(stepTime)/60}分钟`;
                }
                this._showTip(msg);

                this.seek(seekTime, true);
            };

            exports.prototype.rangeSeek = function(range) {
                let duration = this.getDuration();
                let seekTime = Math.max(0, Math.min(duration, duration * range));
                this.seek(seekTime, true);
                this._showTip('定位：' + (range * 100).toFixed(0) + '%');
            };

            exports.prototype.toggleMute = function() {
                if (this.getMuted()) {
                    this.setMuted(false);
                    this._showTip('取消静音');
                } else {
                    this.setMuted(true);
                    this._showTip('静音');
                }
            };

            exports.prototype.adjustVolume = function(value) {
                let volume = this.getVolume() + value;
                volume = Math.max(0, Math.min(1, volume.toFixed(2)));
                this.setVolume(volume);
                this.fire({type: 'keyvolumechange'});
            };

            exports.prototype.adjustPlaybackRate = function(value) {
                const video = this.video();
                let playbackRate = Math.max(0.2, Math.min(5, video.playbackRate + value));
                video.playbackRate = playbackRate;
                this._showTip(`播放速率：${playbackRate.toFixed(1).replace(/\.0+$/, '')}`);
            };

            exports.prototype.resetPlaybackRate = function() {
                const video = this.video();
                video.playbackRate = 1;
                this._showTip('恢复播放速率');
            };

            exports.prototype.hasPreVideo = function() {
                return this._getVideoIndexInList(this._movieinfo.tvid) > 0 || this._getVideoIndexInList(this._movieinfo.oldTvid) > 0;
            };

            exports.prototype.playNext = function() {
                if (this.hasNextVideo()) {
                    this._showTip('播放下一集');
                    this.switchNextVideo();
                } else {
                    this._showTip('没有下一集哦');
                }
            };

            exports.prototype.playPre = function() {
                if (this.hasPreVideo()) {
                    this._showTip('播放上一集');
                    this.switchPreVideo();
                } else {
                    this._showTip('没有上一集哦');
                }
            };
        });
    }

    static _patchKeyShortcuts() {
        Hooker.hookPluginHotKeys((exports) => {
            exports.prototype.init = function() {
                document.addEventListener('keydown', this._keydown.bind(this));
            };

            exports.prototype._isValidTarget = function(target) {
                return target.nodeName === 'BODY' || target.nodeName == 'VIDEO' || target.classList.contains('pw-video'); // 全局
                // return target.nodeName === 'VIDEO' || target.classList.contains('pw-video'); // 非全局
            };

            exports.prototype._keydown = function(event) {
                if (!this._isValidTarget(event.target)) return;

                switch (event.keyCode) {
                case 32: // Spacebar
                    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                        if (this.core.isPaused()) {
                            this.core.play(true);
                            this.core._showTip('播放');
                        } else {
                            this.core.pause(true);
                            this.core._showTip('暂停');
                        }
                    } else {
                        return;
                    }
                    break;
                case 39:    // → Arrow Right
                case 37: {  // ← Arrow Left
                    let stepTime;
                    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                        stepTime = 39 === event.keyCode ? 5 : -5;
                    } else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
                        stepTime = 39 === event.keyCode ? 30 : -30;
                    } else if (!event.ctrlKey && event.shiftKey && !event.altKey) {
                        stepTime = 39 === event.keyCode ? 60 : -60;
                    } else if (event.ctrlKey && !event.shiftKey && event.altKey) {
                        stepTime = 39 === event.keyCode ? 3e2 : -3e2; // 5分钟
                    } else {
                        return;
                    }

                    this.core.stepSeek(stepTime);
                    break;
                }
                case 38: // ↑ Arrow Up
                case 40: // ↓ Arrow Down
                    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                        this.core.adjustVolume(38 === event.keyCode ? 0.05 : -0.05);
                    } else {
                        return;
                    }
                    break;
                case 77: // M
                    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                        this.core.toggleMute();
                    } else {
                        return;
                    }
                    break;
                case 13: // Enter
                    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                        this.core.fire({type: 'togglefullscreen'});
                    } else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
                        this.core.fire({type: 'togglewebfullscreen'});
                    } else {
                        return;
                    }
                    break;
                case 67: // C
                case 88: // X
                    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                        this.core.adjustPlaybackRate(67 === event.keyCode ? 0.1 : -0.1);
                    } else {
                        return;
                    }
                    break;
                case 90: // Z
                    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                        this.core.resetPlaybackRate();
                    } else {
                        return;
                    }
                    break;
                case 68: // D
                case 70: // F
                    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                        this.core.pause(true);
                        if (event.keyCode === 68) {
                            this.core.previousFrame();
                        } else {
                            this.core.nextFrame();
                        }
                    } else {
                        return;
                    }
                    break;
                case 80: // P
                case 78: // N
                    if (!event.ctrlKey && event.shiftKey && !event.altKey) {
                        if (event.keyCode === 78) {
                            this.core.playNext();
                        } else {
                            this.core.playPre();
                        }
                    } else {
                        return;
                    }
                    break;
                default:
                    if (event.keyCode >= 48 && event.keyCode <= 57) { // 0 ~ 9
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this.core.rangeSeek((event.keyCode - 48) * 0.1);
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

            Logger.log('添加键盘快捷键');
        });
    }

    static _patchMouseShortcuts() {
        Hooker.hookPluginControlsInit((that) => {
            document.addEventListener('wheel', (event) => {
                if (!Detector.isFullScreen()) return;

                let delta = event.wheelDelta || event.detail || (event.deltaY && -event.deltaY);
                that.core.adjustVolume(delta > 0 ? 0.05 : -0.05);
            });

            Logger.log('添加鼠标快捷键');
        });
    }

    static patchShortcuts() {
        this._patchCore();

        this._patchKeyShortcuts();
        this._patchMouseShortcuts();
    }

}

export default Patcher;
