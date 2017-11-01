# iqiyi-player-switch

爱奇艺flash播放器与html5播放器随意切换，改善html5播放器播放体验。

## 脚本管理器兼容
`Greasemonkey`用不了（沙箱限制），`Tampermonkey`和`Violentmonkey`可正常使用。

## 安装
* [GitHub](https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/dist/iqiyi-player-switch.user.js)
* [GreasyFork](https://greasyfork.org/zh-CN/scripts/28356-iqiyi-player-switch)

## 脚本实现的功能
* 在脚本管理器上添加菜单命令用于播放器切换（默认启用html5播放器）
* 为`firefox`应用`polyfill`以支持`f4v`播放
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
| esc | 退出网页全屏 |
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

| 操作 | 条件 | 功能 |
| ---- | ---- | ---- |
| 单击左键 | 在播放区域 | 播放 / 暂停 |
| 双击左键 | 在播放区域 | 全屏切换 |
| ctrl + 双击左键 | 在播放区域 | 网页全屏切换 |
| 滚动滚轮 | 全屏或网页全屏 | 音量调节 |

## 切换播放器
菜单命令是要切换过去的播放器

![tm-switch](https://user-images.githubusercontent.com/25021141/27002463-abce11aa-4e15-11e7-96d3-00ba314dbfbe.png)
![vm-switch](https://user-images.githubusercontent.com/25021141/27002466-b3b9407e-4e15-11e7-8c43-c1c7129bd899.png)

## 关于html5播放器清晰度
  * html5 播放器播放 `f4v` 依赖于 `fetch + ReadableStream` 与 `WebRTC`，能否播放或正常播放取决于浏览器。
  * `Chrome/57+` 播放 `f4v` 比较稳定，而内核版本较低的会出现播放出错、回跳。
  * `Firefox` 仍未实现 `ReadableStream` ，只能通过使用 `Polyfill` 来支持播放 `f4v`。
  * `Edge` 也可以播放 `f4v`，但是较低版本需使用 `WebRTC adapter` 且 `Build 15048` 之前的 `ReadableStream` 有[bug](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8196907/)，会出现播放中断。
  * 不支持播放 `f4v` 的浏览器，则只能播放最高清晰度为高清的 `mp4` 或 `m3u8` 。
