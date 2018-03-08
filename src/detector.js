
class Detector {
    static isSupportHtml5() {
        let v = document.createElement('video');
        return !!(
            v.canPlayType('audio/mp4; codecs="mp4a.40.2"') &&
            v.canPlayType('video/mp4; codecs="avc1.640029"') &&
            v.canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.2"')
        );
    }

    static isSupportVms() {
        return !!(
            window.MediaSource && window.URL && window.WebSocket && window.ReadableStream &&
            (window.RTCSessionDescription || window.webkitRTCSessionDescription) &&
            (window.RTCPeerConnection || window.webkitRTCPeerConnection) &&
            (window.RTCIceCandidate || window.webkitRTCIceCandidate)
        );
    }

    static isSupportM3u8() {
        let v = document.createElement('video');
        return !!(
            v.canPlayType('application/x-mpegurl') &&
            v.canPlayType('application/vnd.apple.mpegurl')
        );
    }

    static isChrome() {
        return /chrome/i.test(navigator.userAgent);
    }

    static isFirefox() {
        return /firefox/i.test(navigator.userAgent);
    }

    static isEdge() {
        return /edge/i.test(navigator.userAgent);
    }

    static isInIFrame() {
        return window.top !== window.self;
    }

    static isOutsite() {
        return !/\.iqiyi\.com$/.test(location.host);
    }

    static isOutsideLink() {
        return location.hash === '#outsidelink';
    }

    static hasFlashPlugin() {
        const plugins = unsafeWindow.navigator.plugins;
        return !!(plugins['Shockwave Flash'] && plugins['Shockwave Flash'].description);
    }
}

export default Detector;
