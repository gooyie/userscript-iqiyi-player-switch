const fs = require('fs-extra');

let bundle = 'dist/bundle.js';
let meta = 'src/meta.js';
let output = 'dist/iqiyi-player-switch.user.js';

fs.copySync(meta, output);
fs.appendFileSync(output, fs.readFileSync(bundle));
fs.remove(bundle);
