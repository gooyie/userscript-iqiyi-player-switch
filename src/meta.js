const pkg = require('../package');

module.exports = `
// ==UserScript==
// @name         ${pkg.name}
// @namespace    ${pkg.homepage}
// @homepageURL  ${pkg.homepage}
// @supportURL   ${pkg.bugs.url}
// @updateURL    https://raw.githubusercontent.com/${pkg.author}/userscript-iqiyi-player-switch/master/dist/${pkg.name}.user.js
// @version      ${pkg.version}
// @description  ${pkg.description}
// @author       ${pkg.author}
// @license      ${pkg.license} License
//
// @include      *://*.iqiyi.com/*
// @include      *://v.baidu.com/*
// @include      *://music.baidu.com/mv/*
// @include      *://www.zybus.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        unsafeWindow
// @connect      qiyi.com
// @run-at       document-start
// ==/UserScript==
`;
