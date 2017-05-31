
module.exports = {
    root: true,
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'rules': {
        'indent': [
            'error',
            4
        ],
        'quotes': [
            'error',
            'single',
            {"allowTemplateLiterals": true}
        ],
        'semi': [
            'error',
            'always'
        ],
    },
    globals: {
        GM_registerMenuCommand: false,
        GM_xmlhttpRequest: false,
        unsafeWindow: false,
        GM_addStyle: false,
        GM_getValue: false,
        GM_setValue: false,
        fetchStream: false,
        GM_info: false,
        GM_log: false,
        md5: false,
    }
};
