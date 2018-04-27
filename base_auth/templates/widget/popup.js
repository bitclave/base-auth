import uuid from 'uuid/v4';
import IFrameRPC from '../core/IFrameRPC';

export default class PopupView {
    constructor(widgetOrigin, $inputMnemonic, $buttonSignup, $buttonSignin) {
        this._widgetOrigin = widgetOrigin;
        this._widgetRpc = new IFrameRPC(window.opener, widgetOrigin);

        this._$inputMnemonic = $inputMnemonic;
        this._$buttonSignup = $buttonSignup;
        this._$buttonSignin = $buttonSignin;

        this._$buttonSignup.on('click', this._onClickSignin.bind(this));
        this._$buttonSignin.on('click', this._onClickSignin.bind(this));
    }

    _onClickSignin(e) {
        const mnemonic = this._parseMnemonic();

        if (mnemonic) {
            e.preventDefault();
            this._widgetRpc.call('submitMnenomic', [mnemonic]);
            window.close();
            return;
        }
    }

    _parseMnemonic() {
        return this._$inputMnemonic.val();
    }
}
