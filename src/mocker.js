import Detector from './detector';
import Cookies from './cookies';
import Hooker from './hooker';
import Faker from './faker';
import Logger from './logger';

class Mocker {

    static mock() {
        this.mockForBestDefintion();
        this.mockAd();
        this.mockVip();
        this.mockLogo();
        this.mockCheckPlugin();
    }

    static mockToUseVms() {
        Faker.fakeChrome();
    }

    static mockToUseM3u8() {
        Faker.fakeMacPlatform();
        Faker.fakeSafari();
    }

    static mockForBestDefintion() {
        // fall-back
        if (Detector.isSupportVms()) {
            if (!Detector.isChrome()) this.mockToUseVms(); // vms, 1080p or higher
        } else if (Detector.isSupportM3u8()) {
            this.mockToUseM3u8(); // tmts m3u8
        } else {
            // by default, tmts mp4 ...
        }
    }

    static _isAdReq(url) {
        const AD_URL = 'http://t7z.cupid.iqiyi.com/show2';
        return url.indexOf(AD_URL) === 0;
    }

    static mockAd() {
        Hooker.hookJqueryAjax((url, options) => {
            if (this._isAdReq(url)) {
                let res = Faker.fakeAdRes();
                (options.complete || options.success)({responseJSON: res}, 'success');
                Logger.log(`mocked ad request ${url}`);
                return true;
            }
        });
    }

    static _isCheckVipReq(url) {
        const CHECK_VIP_URL = 'https://cmonitor.iqiyi.com/apis/user/check_vip.action';
        return url === CHECK_VIP_URL;
    }

    static _isLogin() {
        return !!Cookies.get('P00001');
    }

    static mockVip() {
        if (!this._isLogin()) Faker.fakePassportCookie();

        Hooker.hookHttpJsonp((options) => {
            let url = options.url;

            if (this._isCheckVipReq(url)) {
                let res = Faker.fakeVipRes(options.params.authcookie);
                options.success(res);
                Logger.log(`mocked check vip request ${url}`);
                return true;
            }
        });
    }

    static mockLogo() {
        Hooker.hookLogo(exports => exports.prototype.showLogo = ()=>{});
    }

    static mockCheckPlugin() {
        Hooker.hookSkinBase((exports) => {
            exports.prototype._checkPlugin = () => {};
        });
    }

}

export default Mocker;
