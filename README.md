## 简述
爱奇艺flash播放器与html5播放器随意切换，html5播放器广告和谐与免vip看1080p、4k。

## 安装
* [GitHub](https://raw.githubusercontent.com/gooyie/userscript-iqiyi-player-switch/master/iqiyi-player-switch.user.js)
* [GreasyFork](https://greasyfork.org/zh-CN/scripts/28356-iqiyi-player-switch)

## 使用
在播放页面点击`Tampermonkey`图标，然后再点击`HTML5播放器`或`Flash播放器`。

## 兼容性
* 使用了es6语法，比较旧的浏览器和`Tampermonkey`不支持。
* html5播放器清晰度（以最新版本的浏览器进行测试）
  * Chrome浏览器已实现了播放f4v用到的新api，直接播放有720p及以上清晰度的f4v。
  * Firefox和Edge浏览器因一些新api未实现，所以只能播放最高清晰度为高清的mp4或m3u8。
  * 其它浏览器未测试。
* 较低版本的Chrome浏览器对新的api支持不是很好，html5播放器不能正常播放。

## 视频广告
广告已和谐（仅限于html5播放器），无需广告拦截扩展。

## 已知问题
* html5播放器在网络不佳会出现『`播放出错了，请稍候片刻，刷新重试(P2P200)`』

## 用到的库
* [blueimp/JavaScript-MD5](https://github.com/blueimp/JavaScript-MD5)
