### 用于
爱奇艺flash播放器与html5播放器之间切换

### 使用姿势
在播放页面点击**Tampermonkey**图标，然后在点击**Switch Player**。

### 兼容性
* 使用了es6语法，比较旧的浏览器不支持。
* Chrome浏览器支持720p及以上清晰度，Firefox和Edge浏览器只能高清；其它浏览器未测试。

### 视频广告
把以下规则加入广告拦截扩展后在h5播放器下可以跳过视频广告。
```
||t7z.cupid.iqiyi.com/show2?e=
```

### 已知问题
* 爱奇艺h5播放器未支持弹幕。
* 爱奇艺h5播放器还不是很稳定，可以会出现各种播放错误。

### 仓库
[GitHub](https://github.com/gooyie/userscript-iqiyi-player-switch)
