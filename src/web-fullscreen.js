import Hooker from './hooker';

let webFullscreen;
Hooker.hookWebFullScreen(_exports => webFullscreen = _exports);

export { webFullscreen };
