# iqiyi-player-switch

爱奇艺flash播放器与html5播放器随意切换，改善html5播放器播放体验。

## 脚本管理器兼容
`Greasemonkey`用不了（沙箱限制），`Tampermonkey`和`Violentmonkey`可正常使用。

## 安装
* [GitHub](https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/iqiyi-player-switch.user.js)（源码）
* [GreasyFork](https://greasyfork.org/zh-CN/scripts/28356-iqiyi-player-switch)（已转码）

## 脚本实现的功能
* 在脚本管理器上添加菜单命令用于播放器切换（默认启用html5播放器）
* 为`firefox`、`edge`应用`polyfill`以支持`f4v`播放
* 和谐广告
* 和谐非内嵌水印
* 解除会员清晰度限制
* [外链html5播放](https://github.com/gooyie/userscript-iqiyi-player-switch/issues/7)（不完善）

## 切换播放器
菜单命令是要切换过去的播放器

![tm-switch](https://user-images.githubusercontent.com/25021141/27002463-abce11aa-4e15-11e7-96d3-00ba314dbfbe.png)
![vm-switch](https://user-images.githubusercontent.com/25021141/27002466-b3b9407e-4e15-11e7-8c43-c1c7129bd899.png)

## 关于html5播放器清晰度
  * html5 播放器播放 `f4v` 依赖于 `fetch + ReadableStream` 与 `WebRTC`，能否播放或正常播放取决于浏览器。
  * `Chrome/57.0.2987.133+` 可以很好的播放`f4v`。
  * `Firefox/53.0` 仍未实现 `ReadableStream` ，通过使用 `Polyfill` 后也可以很好的播放 `f4v`。
  * `Edge` 使用 `WebRTC adapter` 后也可以播放 `f4v`。但是 `Build 15048` 之前的 `ReadableStream` 有[bug](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8196907/)，会出现播放中断  。
  * 不支持播放 `f4v` 的浏览器， 则会自动播放最高清晰度为高清的 `mp4` 或 `m3u8` 。

## 用到的库
* [blueimp/JavaScript-MD5](https://github.com/blueimp/JavaScript-MD5)
* [jonnyreeves/fetch-readablestream](https://github.com/jonnyreeves/fetch-readablestream)
* [creatorrr/web-streams-polyfill](https://github.com/creatorrr/web-streams-polyfill)
* [webrtc/adapter](https://github.com/webrtc/adapter)
