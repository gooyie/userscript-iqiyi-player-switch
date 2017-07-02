import 'webrtc-adapter';
import 'web-streams-polyfill';
import fetchStream from '../node_modules/fetch-readablestream/src';
import Logger from './logger';
import Detector from './detector';

function isVideoReq(url) {
    return /^https?:\/\/(?:\d+.?){4}\/videos\/v.*$/.test(url);
}

if (Detector.isFirefox()) {
    const fetch = unsafeWindow.fetch.bind(unsafeWindow);

    unsafeWindow.fetch = (url, opts) => {
        if (isVideoReq(url)) {
            Logger.log(`fetching stream ${url}`);
            return fetchStream(url, opts); // xhr with moz-chunked-arraybuffer
        } else {
            return fetch(url, opts);
        }
    };
}
