
class Cookies {
    static get(key) {
        let value;
        if (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+$').test(key)) { // eslint-disable-line no-control-regex
            let re = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
            let rs = re.exec(document.cookie);
            value = rs ? rs[2] : '';
        }
        return value ? decodeURIComponent(value) : '';
    }

    static set(k, v, o={}) {
        let n = o.expires;
        if ('number' == typeof o.expires) {
            n = new Date();
            n.setTime(n.getTime() + o.expires);
        }
        let key = k;
        let value = encodeURIComponent(v);
        let path = o.path ? '; path=' + o.path : '';
        let expires = n ? '; expires=' + n.toGMTString() : '';
        let domain = o.domain ? '; domain=' + o.domain : '';
        document.cookie = `${key}=${value}${path}${expires}${domain}`;
    }

    static remove(k, o={}) {
        o.expires = new Date(0);
        this.set(k, '', o);
    }
}

export default Cookies;
