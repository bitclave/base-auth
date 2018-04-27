import IFrameRPC from '../core/IFrameRPC.js';
import Base, {
    KeyPairFactory,
    Permissions,
    RepositoryStrategyType,
    TransportFactory,
} from 'bitclave-base';

export default class WidgetView {
    constructor(
        baseNodeApiUrl, $button, buttonLabel, popupUrl, popupName, widgetOrigin
    ) {
        this._$button = $button
        this._buttonLabel = buttonLabel
        this._popupUrl = popupUrl;
        this._popupName = popupName;
        this._widgetOrigin = widgetOrigin;

        this._parent = window.parent;
        this._parentOrigin = null;
        this._parentRpc = null;

        this._applicationVerificationMessage = null;

        const httpTransport = TransportFactory.createHttpTransport(baseNodeApiUrl);
        const keyPairHelper = KeyPairFactory.createDefaultKeyPair(new Permissions(['any']));
        this._baseNodeApi = Base.Builder()
            .setHttpTransport(httpTransport)
            .setKeyParHelper(keyPairHelper)
            .setRepositoryStrategy(RepositoryStrategyType.Postgres)
            .build();
        this._$button.on('click', this._onClickLogin.bind(this));
    }

    initialize() {
        const parentRpc = new IFrameRPC(this._parent, '*');

        return parentRpc.call('handshake', []).then(response => {
            this._parentOrigin = response.event.origin;
            this._parentRpc = new IFrameRPC(this._parent, this._parentOrigin);
            this._applicationVerificationMessage = response.value.verificationMessage;
        });
    }

    enableButton() {
        this._$button.prop('disabled', false);
        this._$button.text(this._buttonLabel);
    }

    disableButton(event) {
        this._$button.prop('disabled', true);
        this._$button.text('Loading...');
    }

    _onClickLogin(event) {
        const $button = $(event.target);
        const popup = window.open(
            this._popupUrl, this._popupName, "height=500, width=500"
        );
        const popupRpc = new IFrameRPC(popup, this._widgetOrigin);

        popupRpc.once('submitMnenomic').then(rpcCall => {
            this.disableButton();
            return this._login(rpcCall.args[0]);
        }).then(() => {
            $button.text('Logged in!');
        });
        popup.focus();
    }

    _login(mnemonic) {
        return this._baseNodeApi.accountManager.authenticationByPassPhrase(
            mnemonic,
            this._applicationVerificationMessage
        ).then(account => {
            this._parentRpc.call('onLogin', [account]);
            new BASENodeAPICallListener(
                this._parent,
                this._parentOrigin,
                this._parentRpc,
                this._baseNodeApi
            ).listen();
        });
    }
}

class BASENodeAPICallListener {
    constructor(parent, parentOrigin, parentRpc, baseNodeApi) {
        this._parent = parent;
        this._parentOrigin = parentOrigin;
        this._parentRpc = parentRpc;
        this._baseNodeApi = baseNodeApi;
    }

    listen() {
        this._parentRpc.listen('offerManager.getAllOffers', this._getAllOffers.bind(this));
        this._parentRpc.listen('profileManager.getData', this._getData.bind(this));
        this._parentRpc.listen('profileManager.updateData', this._updateData.bind(this));
    }

    _respond(rpcCall, response) {
        rpcCall.respond(this._parent, this._parentOrigin, response);
    }

    _getAllOffers(rpcCall) {
        this._baseNodeApi.offerManager.getAllOffers().then(this._respond.bind(this, rpcCall));
    }

    _getData(rpcCall) {
        this._baseNodeApi.profileManager.getData().then(this._respond.bind(this, rpcCall));
    }

    _updateData(rpcCall) {
        const dataObj = rpcCall.args[0];
        const dataMap = new Map(Object.keys(dataObj).map(key => [key, dataObj[key]]));

        this._baseNodeApi.profileManager.updateData(dataMap).then(this._respond.bind(this, rpcCall));
    }
}
