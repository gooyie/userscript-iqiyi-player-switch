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
            Logger.info(`fetching stream ${url}`);
            return fetchStream(url, opts).then((res) => {
                if (!res.ok) { // 出错
                    throw new TypeError('Failed to fetch'); // 则切换到 WebSocket loader
                }
                return res;
            });
        } else {
            return fetch(url, opts);
        }
    };
}
