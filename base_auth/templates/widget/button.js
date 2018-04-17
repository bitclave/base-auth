import IFrameRPC from '../core/IFrameRPC.js';

export default function WidgetView(baseNodeApiUrl, $button, popupUrl, popupName, widgetOrigin) {
    this._popupUrl = popupUrl;
    this._popupName = popupName;
    this._widgetOrigin = widgetOrigin;

    this._parent = window.parent;
    this._parentOrigin = null;
    this._parentRpc = null;

    $button.on('click', this._onClickLogin.bind(this));

    const httpTransport = BitclaveBase.TransportFactory.createHttpTransport(baseNodeApiUrl);
    const keyPairHelper = BitclaveBase.KeyPairFactory.createDefaultKeyPair();
    this._baseNodeApi = BitclaveBase.NodeAPI.Builder()
        .setHttpTransport(httpTransport)
        .setKeyParHelper(keyPairHelper)
        .setRepositoryStrategy(BitclaveBase.RepositoryStrategyType.Postgres)
        .build();
}

WidgetView.prototype._onClickLogin = function (event) {
    const $button = $(event.target);
    const popup = window.open(this._popupUrl, this._popupName, "height=500, width=500");
    const popupRpc = new IFrameRPC(popup, this._widgetOrigin);

    popupRpc.once('submitMnenomic').then(function (rpcCall) {
        $button.prop('disabled', true);
        $button.text('Loading...');
        return this._login(rpcCall.args[0]);
    }.bind(this)).then(function () {
        $button.text('Logged in!');
    });
    popup.focus();
};

WidgetView.prototype._login = function (mnemonic) {
    const parentRpc = new IFrameRPC(this._parent, '*');
    return parentRpc.call('getOrigin', []).then(function (origin) {
        this._parentOrigin = origin;
        this._parentRpc = new IFrameRPC(this._parent, this._parentOrigin);
    }.bind(this)).then(function () {
        return this._baseNodeApi.accountManager.checkAccount(mnemonic);
    }.bind(this)).then(
        function (account) {
            return account;
        },
        function (response) {
            if (response.status == 404) {
                return this._baseNodeApi.accountManager.registration(mnemonic);
            }
        }.bind(this)
    ).then(function (account) {
        this._parentRpc.call('onLogin', [account]);
        this._listen();
    }.bind(this));
};

WidgetView.prototype._listen = function () {
    this._parentRpc.listen('offerManager.getAllOffers', this._getAllOffers.bind(this));
    this._parentRpc.listen('profileManager.getData', this._getData.bind(this));
    this._parentRpc.listen('profileManager.updateData', this._updateData.bind(this));
};

WidgetView.prototype._respond = function (rpcCall, response) {
    rpcCall.respond(this._parent, this._parentOrigin, response);
};

WidgetView.prototype._getAllOffers = function (rpcCall) {
    this._baseNodeApi.offerManager.getAllOffers().then(this._respond.bind(this, rpcCall));
};

WidgetView.prototype._getData = function (rpcCall) {
    this._baseNodeApi.profileManager.getData().then(this._respond.bind(this, rpcCall));
};

WidgetView.prototype._updateData = function (rpcCall) {
    const dataObj = rpcCall.args[0];
    const dataMap = new Map(Object.keys(dataObj).map(key => [key, dataObj[key]]));

    this._baseNodeApi.profileManager.updateData(dataMap).then(this._respond.bind(this, rpcCall));
};
