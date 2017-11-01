import Hooker from './hooker';

let fullscreen;
Hooker.hookFullScreen(_exports => fullscreen = _exports);

export { fullscreen };
