import IFrameRPC from './core/IFrameRPC.js';
import Settings from 'settings';

export const UserPermissions = {
    WEALTH: 'wealth',  // TODO Загружать с бэкенда?
};

export class Widget {
    constructor(options) {
        this._widgetIframe = null;
        this._widgetRpc = null;
        this._baseNodeApi = null;
        this._applicationPublicKey = options.applicationPublicKey;
        this._userPermissions = options.userPermissions;

        if (!this._applicationPublicKey) {
            throw new Error('applicationPublicKey is required');
        }

        if (!this._userPermissions) {
            throw new Error('userPermissions is required');
        }
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
        this._widgetRpc.once('handshake').then(rpcCall => {
            rpcCall.respond(
                this._widgetIframe.contentWindow,
                Settings.siteUrl(),
                true
            );
            this._baseNodeApi = new BASENodeAPI(this._widgetRpc);
        });

        this._widgetRpc.once('getApplicationPublicKey').then(function (rpcCall) {
            rpcCall.respond(
                this._widgetIframe.contentWindow,
                Settings.siteUrl(),
                this._applicationPublicKey
            );
        }.bind(this));

        this._widgetRpc.once('getUserPermissions').then(function (rpcCall) {
            rpcCall.respond(
                this._widgetIframe.contentWindow,
                Settings.siteUrl(),
                this._userPermissions
            );
        }.bind(this));
    }

    waitForLogin() {
        return this._widgetRpc.once('onLogin').then(function (rpcCall) {
            const account = rpcCall.args[0];
            return account;
        });
    }
}

class BASENodeAPI {
    constructor(widgetRpc) {
        this._widgetRpc = widgetRpc;
    }

    getAllOffers () {
        return this._widgetRpc.call('offerManager.getAllOffers', []).then(response => response.value);
    }

    getData() {
        return this._widgetRpc.call('profileManager.getData', []).then(response => response.value);
    }

    updateData(data) {
        return this._widgetRpc.call('profileManager.updateData', [data]).then(response => response.value);
    }
}
