function BASEAuthWidget() {
    this._baseNodeApi = new Base.NodeAPI('https://base2-bitclva-com.herokuapp.com');
    this._parent = window.parent;
    this._parentOrigin = null;
    this._parentRpc = null;
}

BASEAuthWidget.prototype.login = function (mnemonic) {
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

BASEAuthWidget.prototype._listen = function () {
    this._parentRpc.listen('offerManager.getAllOffers', this._getAllOffers.bind(this));
    this._parentRpc.listen('profileManager.getData', this._getData.bind(this));
    this._parentRpc.listen('profileManager.updateData', this._updateData.bind(this));
};

BASEAuthWidget.prototype._respond = function (rpcCall, response) {
    rpcCall.respond(this._parent, this._parentOrigin, response);
};

BASEAuthWidget.prototype._getAllOffers = function (rpcCall) {
    this._baseNodeApi.offerManager.getAllOffers().then(this._respond.bind(this, rpcCall));
};

BASEAuthWidget.prototype._getData = function (rpcCall) {
    this._baseNodeApi.profileManager.getData().then(this._respond.bind(this, rpcCall));
};

BASEAuthWidget.prototype._updateData = function (rpcCall) {
    const dataObj = rpcCall.args[0];
    const dataMap = new Map(Object.keys(dataObj).map(key => [key, dataObj[key]]));

    this._baseNodeApi.profileManager.updateData(dataMap).then(this._respond.bind(this, rpcCall));
};
