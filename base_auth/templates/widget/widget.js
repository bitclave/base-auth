{% include "widget/IFrameRPC.js" %}

function BASEAuth() {
    this._widgetIframe = null;
    this._widgetRpc = null;
}

BASEAuth.prototype.insertLoginButton = function (cssSelector) {
    const iframe = document.createElement('iframe');
    iframe.src = "{{ SITE_URL }}{% url 'widget:button' %}";
    iframe.sandbox = 'allow-scripts allow-popups allow-same-origin allow-modals';

    const el = document.querySelector(cssSelector);
    el.appendChild(iframe);
    this._widgetIframe = iframe;

    this._widgetRpc = new IFrameRPC(this._widgetIframe.contentWindow, "{{ SITE_URL }}");
    this._widgetRpc.once('getOrigin').then(function (rpcCall) {
        rpcCall.respond(this._widgetIframe.contentWindow, "{{ SITE_URL }}", window.location.origin);
    }.bind(this));
};

BASEAuth.prototype.waitForLogin = function () {
    return this._widgetRpc.once('onLogin');
};

BASEAuth.prototype.getAllOffers = function () {
    return this._widgetRpc.call('offerManager.getAllOffers', []);
};

BASEAuth.prototype.getData = function () {
    return this._widgetRpc.call('profileManager.getData', []);
};

BASEAuth.prototype.updateData = function (data) {
    return this._widgetRpc.call('profileManager.updateData', [data]);
};
