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
* 快捷键

## 键盘快捷键
快捷键仿照`PotPlayer`和`youtube`

| 按键 | 功能 |
| ---- | ---- |
| 空格 | 播放 / 暂停 |
| enter | 全屏 / 退出全屏 |
| ctrl + enter | 网页全屏 / 退出网页全屏 |
| ↑ | 音量增加 5% |
| ↓ | 音量减少 5% |
| m | 静音 / 取消静音 |
| d | 上一帧 |
| f | 下一帧 |
| ← | 步退5秒 |
| → | 步进5秒 |
| ctrl + ← | 步退30秒 |
| ctrl + → | 步进30秒 |
| shift + ← | 步退1分钟 |
| shift + → | 步进1分钟 |
| ctrl + alt + ← | 步退5分钟 |
| ctrl + alt + → | 步进5分钟 |
| 0 ~ 9 | 定位到视频的 x0%|
| c | 播放速率提高 0.1 |
| x | 播放速率降低 0.1 |
| z | 恢复正常播放速率 |
| shift + p | 播放上一集 |
| shift + n | 播放下一集 |

## 鼠标快捷键

| 操作 | 功能 |
| ---- | ---- |
| 在播放区域双击左键<sup>[原](#note)<sup> | 全屏切换 |
| 全屏下滚动滚轮 | 音量调节 |

<a name='note'>原</a>: 爱奇艺原有功能

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
