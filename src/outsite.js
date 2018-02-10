import Logger from './logger';
import Hooker from './hooker';
import Faker from './faker';
import Detector from './detector';
import { getVideoUrl, findVid, findTvid } from './utils';

async function embedSrc(targetNode, {tvid, vid}) {
    targetNode.innerHTML = `<div class="${GM_info.script.name} info">正在获取视频源...</div>`;

    try {
        let url = await getVideoUrl(tvid, vid);
        Logger.info('source url: %s', url);
        targetNode.innerHTML = `<iframe id="innerFrame" src="${url}" frameborder="0" allowfullscreen="true" width="100%" height="100%"></iframe>`;
    } catch (err) {
        targetNode.innerHTML = `<div class="${GM_info.script.name} error"><p>获取视频源出错！</p><p>${err.message}</p></div>`;
    }
}

function replaceFlash() {
    if (!Detector.hasFlashPlugin()) Faker.fakeFlashPlugin();

    const observer = new MutationObserver((records, self) => {
        for (let record of records) {
            if (record.type !== 'childList' || !record.addedNodes) continue;

            for (let node of record.addedNodes) {
                if (node.nodeName !== 'OBJECT' && node.nodeName !== 'EMBED') continue;
                Logger.info('found node', node);

                let text = node.outerHTML;
                let vid = findVid(text);
                let tvid = findTvid(text);

                if (tvid && vid) {
                    Logger.info('found tvid: %s, vid: %s', tvid, vid);
                    embedSrc(node.parentNode, {tvid, vid});
                    self.disconnect();
                    Logger.info('stoped observation');
                }
            }
        }
    });

    observer.observe(document.body || document.documentElement, {subtree: true, childList: true});
    Logger.info('started observation');
}

function adaptIframe() {
    let style = `
        body[class|="qypage"] {
            overflow: hidden !important;
            background: #000 !important;
            visibility: hidden;
        }

        .mod-func {
            display: none !important;
        }

        .${GM_info.script.name}.info {
            width: 20em;
            height: 5em;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            text-align: center;
            line-height: 5em;
            font-size: 1em;
            color: #ccc;
        }

        .${GM_info.script.name}.error {
            height: 3em;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            text-align: center;
            font-size: 1em;
            color: #c00;
        }
    `;

    GM_addStyle(style);

    Hooker.hookWebFullScreen((exports) => {
        const init = exports.__proto__.init;
        exports.__proto__.init = function(wrapper, btn) {
            init.apply(this, [wrapper, btn]);
            this.enter();

            btn[0].style.display = 'none';
            document.body.style.visibility = 'visible';
        };

        exports.__proto__.exit = () => {};
    });

    Hooker.hookCore((exports) => {
        exports.prototype.hasNextVideo = () => null;
    });
}

export { replaceFlash, adaptIframe };
