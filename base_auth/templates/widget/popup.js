import uuid from 'uuid/v4';
import IFrameRPC from '../core/IFrameRPC';

export default class PopupView {
    constructor(
        widgetOrigin,
        $inputMnemonic, $inputLogin, $inputPassword,
        $buttonSignup, $buttonSignin
    ) {
        this._widgetOrigin = widgetOrigin;
        this._widgetRpc = new IFrameRPC(window.opener, widgetOrigin);

        this._$inputMnemonic = $inputMnemonic;
        this._$inputLogin = $inputLogin;
        this._$inputPassword = $inputPassword;
        this._$buttonSignup = $buttonSignup;
        this._$buttonSignin = $buttonSignin;

        this._$buttonSignup.on('click', this._onClickSignin.bind(this));
        this._$buttonSignin.on('click', this._onClickSignin.bind(this));
    }

    _onClickSignin(e) {
        const mnemonic = this._parseMnemonic();
        const login = this._parseLogin();
        const password = this._parsePassword();

        if (mnemonic && !login && !password) {
            e.preventDefault();
            this._widgetRpc.call('submitMnenomic', [mnemonic]);
            window.close();
            return;
        }

        if (!mnemonic && login && password) {
            debugger;
            // TODO
            // - Сразу рендерить форму выбора разрешений
            // - Отправить форму на сервер
            // - Далее по схеме взаимодействия base auth
            return;
        }
    }

    _parseMnemonic() {
        return this._$inputMnemonic.val();
    }

    _parseLogin() {
        return this._$inputLogin.val();
    }

    _parsePassword() {
        return this._$inputPassword.val();
    }
}
