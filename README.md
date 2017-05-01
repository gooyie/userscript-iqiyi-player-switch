## 简述
爱奇艺flash播放器与html5播放器随意切换，html5播放器广告和谐与免vip看1080p、4k。

## 安装
* [GitHub](https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/iqiyi-player-switch.user.js)
* [GreasyFork](https://greasyfork.org/zh-CN/scripts/28356-iqiyi-player-switch)

## 使用
在播放页面点击`Tampermonkey`图标，然后再点击`HTML5播放器`或`Flash播放器`。

## 兼容性
* 使用了es6语法，比较旧的浏览器和`Tampermonkey`不支持。
* html5播放器清晰度
  * html5 播放器播放 `f4v` 依赖于 `fetch + ReadableStream` 与   `WebRTC`，能否播放或正常播放取决于浏览器。
  * `Chrome/57.0.2987.133+` 可以很好的播放`f4v`。
  * `Firefox/53.0` 仍未实现 `ReadableStream` ，通过使用 `Polyfill` 后也可以很好的播放 `f4v`。
  * `Edge` 使用 `WebRTC adapter` 后也可以播放 `f4v`。但是 `Build 15048` 之前的 `ReadableStream` 有   [bug](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8196907/)，会出现播放中断  。
  * 不支持播放 `f4v` 的浏览器， 则会自动播放最高清晰度为高清的 `mp4` 或 `m3u8` 。

## 视频广告
广告已和谐（仅限于html5播放器），无需广告拦截扩展。

## 已知问题
* html5播放器在网络不佳会出现『`播放出错了，请稍候片刻，刷新重试(P2P200)`』

## 用到的库
* [blueimp/JavaScript-MD5](https://github.com/blueimp/JavaScript-MD5)
* [jonnyreeves/fetch-readablestream](https://github.com/jonnyreeves/fetch-readablestream)
* [creatorrr/web-streams-polyfill](https://github.com/creatorrr/web-streams-polyfill)
* [webrtc/adapter](https://github.com/webrtc/adapter)
