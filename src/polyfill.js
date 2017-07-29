import 'webrtc-adapter';
import 'web-streams-polyfill';
import fetchStream from '../node_modules/fetch-readablestream/src';
import Logger from './logger';
import Detector from './detector';

function isVideoReq(url) {
    const u = new URL(url);
    return u.pathname.startsWith('/videos/') && u.pathname.endsWith('.f4v');
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
