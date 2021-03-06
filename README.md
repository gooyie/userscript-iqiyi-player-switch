# iqiyi-player-switch

爱奇艺flash播放器与html5播放器随意切换，改善html5播放器播放体验。

## 脚本管理器兼容
`Greasemonkey`用不了（沙箱限制），`Tampermonkey`和`Violentmonkey`可正常使用。

## 安装
* [GitHub](https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/dist/iqiyi-player-switch.user.js)
* [GreasyFork](https://greasyfork.org/zh-CN/scripts/28356-iqiyi-player-switch)

## 脚本实现的功能
* 在脚本管理器上添加菜单命令用于播放器切换（默认启用html5播放器）
* firefox 播放`f4v`
* 和谐广告
* 和谐非内嵌水印
* 解除会员清晰度限制
* [外链html5播放](https://github.com/gooyie/userscript-iqiyi-player-switch/issues/7)（不完善）
* 快捷键
* 可选的使用 WebSocket 加载视频

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
| z | 正常/之前的播放速率 |
| shift + p | 播放上一集 |
| shift + n | 播放下一集 |

## 鼠标快捷键

| 操作 | 条件 | 功能 |
| ---- | ---- | ---- |
| 单击左键 | 在播放区域 | 播放 / 暂停 |
| 双击左键 | 在播放区域 | 全屏切换 |
| ctrl + 双击左键 | 在播放区域 | 网页全屏切换 |
| 滚动滚轮 | 全屏或网页全屏 | 音量调节 |

## WebSocket
在播放器的设置里添加了一个开关，默认为关闭状态。

![WebSocket setting](https://user-images.githubusercontent.com/25021141/37519377-d305b5e2-2953-11e8-96e6-b2d63210c479.png)

开启就使用 WebSocket 加载视频，可规避ISP的缓存避免被重定向出现 CORS 错误。

![blocked by CORS policy](https://user-images.githubusercontent.com/25021141/37519374-d05a6446-2953-11e8-931e-59e31f3e7af3.png)

不开启就是按照 iqiyi 的策略，即默认使用 Fetch 或 XHR(firefox)，如果一直出错就尝试用 WebSocket。

**注意：[有些地区的CDN还不支持 WebSocket，启用后会无法播放。](https://github.com/gooyie/userscript-iqiyi-player-switch/issues/21)**

## 切换播放器
菜单命令是要切换过去的播放器

![tm-switch](https://user-images.githubusercontent.com/25021141/27002463-abce11aa-4e15-11e7-96d3-00ba314dbfbe.png)
![vm-switch](https://user-images.githubusercontent.com/25021141/27002466-b3b9407e-4e15-11e7-8c43-c1c7129bd899.png)
