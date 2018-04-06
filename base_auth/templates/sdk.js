import IFrameRPC from './core/IFrameRPC.js';
import Settings from 'settings';

export {Widget};

function Widget() {
    this._widgetIframe = null;
    this._widgetRpc = null;
}

Widget.prototype.insertLoginButton = function (cssSelector) {
    const iframe = document.createElement('iframe');
    iframe.src = Settings.siteUrl() + Settings.widgetLocation();
    iframe.sandbox = 'allow-scripts allow-popups allow-same-origin allow-modals';

    const el = document.querySelector(cssSelector);
    el.appendChild(iframe);
    this._widgetIframe = iframe;

    this._widgetRpc = new IFrameRPC(this._widgetIframe.contentWindow, Settings.siteUrl());
    this._widgetRpc.once('getOrigin').then(function (rpcCall) {
        rpcCall.respond(this._widgetIframe.contentWindow, Settings.siteUrl(), window.location.origin);
    }.bind(this));
};

Widget.prototype.waitForLogin = function () {
    return this._widgetRpc.once('onLogin');
};

Widget.prototype.getAllOffers = function () {
    return this._widgetRpc.call('offerManager.getAllOffers', []);
};

Widget.prototype.getData = function () {
    return this._widgetRpc.call('profileManager.getData', []);
};

Widget.prototype.updateData = function (data) {
    return this._widgetRpc.call('profileManager.updateData', [data]);
};
