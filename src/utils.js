
function getVideoUrl(tvid, vid) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: `http://cache.video.qiyi.com/jp/vi/${tvid}/${vid}/?callback=callback`,
            method: 'GET',
            timeout: 8e3,
            onload: (details) => {
                try {
                    let json = JSON.parse(/callback\s*\(\s*(\{.*\})\s*\)/.exec(details.responseText)[1]);
                    resolve(json.vu);
                } catch (err) {
                    reject(err);
                }
            },
            onerror: reject,
            onabort: reject,
            ontimeout: reject
        });
    });
}

function findVid(text) {
    let result = /vid=([\da-z]+)/i.exec(text);
    return result ? result[1] : null;
}

function findTvid(text) {
    let result = /tvid=(\d+)/i.exec(text);
    return result ? result[1] : null;
}

export { getVideoUrl, findVid, findTvid };
