import uuid from 'uuid/v4';
import IFrameRPC from '../core/IFrameRPC';

export default class PopupView {
    constructor(widgetOrigin, $inputMnemonic, $buttonSignup, $buttonSignin) {
        this.widgetOrigin = widgetOrigin;
        this.widgetRpc = new IFrameRPC(window.opener, widgetOrigin);

        this.$inputMnemonic = $inputMnemonic;
        this.$buttonSignup = $buttonSignup;
        this.$buttonSignin = $buttonSignin;

        this.$buttonSignup.on('click', this._onClickSignin.bind(this));
        this.$buttonSignin.on('click', this._onClickSignin.bind(this));
    }

    _onClickSignin() {
        const mnemonic = this._parseMnemonic();

        if (!mnemonic) {
            return;
        }

        this.widgetRpc.call('submitMnenomic', [mnemonic]);
        window.close();
    }

    _parseMnemonic() {
        return this.$inputMnemonic.val();
    }
}
