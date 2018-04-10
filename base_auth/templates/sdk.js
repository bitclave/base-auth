import IFrameRPC from './core/IFrameRPC.js';
import Settings from 'settings';

export {Widget};

class BASENodeAPI {
    constructor(widgetRpc) {
        this._widgetRpc = widgetRpc;
    }

    getAllOffers () {
        return this._widgetRpc.call('offerManager.getAllOffers', []);
    }

    getData() {
        return this._widgetRpc.call('profileManager.getData', []);
    }

    updateData(data) {
        return this._widgetRpc.call('profileManager.updateData', [data]);
    }
}

class Widget {
    constructor() {
        this._widgetIframe = null;
        this._widgetRpc = null;
        this._baseNodeApi = null;
    }

    get baseNodeAPI() {
        return this._baseNodeApi;
    }

    insertLoginButton(cssSelector) {
        const iframe = document.createElement('iframe');
        iframe.src = Settings.siteUrl() + Settings.widgetLocation();
        iframe.sandbox = 'allow-scripts allow-popups allow-same-origin allow-forms allow-modals';

        const el = document.querySelector(cssSelector);
        el.appendChild(iframe);
        this._widgetIframe = iframe;

        this._widgetRpc = new IFrameRPC(this._widgetIframe.contentWindow, Settings.siteUrl());
        this._widgetRpc.once('getOrigin').then(function (rpcCall) {
            rpcCall.respond(
                this._widgetIframe.contentWindow, Settings.siteUrl(), window.location.origin
            );
            this._baseNodeApi = new BASENodeAPI(this._widgetRpc);
        }.bind(this));
    }

    waitForLogin() {
        return this._widgetRpc.once('onLogin').then(function (rpcCall) {
            const account = rpcCall.args[0];
            return account;
        });
    }
}
