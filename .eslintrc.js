
module.exports = {
    root: true,
    parser: 'babel-eslint',
    'env': {
        'browser': true,
        'node': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 6,
        'sourceType': 'module'
    },
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
        GM_info: false,
    }
};
