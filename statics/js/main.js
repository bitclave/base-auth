(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("BASEAuth", [], factory);
	else if(typeof exports === 'object')
		exports["BASEAuth"] = factory();
	else
		root["BASEAuth"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./base_auth/templates/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./base_auth/templates/core/IFrameRPC.js":
/*!***********************************************!*\
  !*** ./base_auth/templates/core/IFrameRPC.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return IFrameRPC; });\nfunction RPCCall(id, methodName, args, resolve) {\n    this.id = id;\n    this.methodName = methodName;\n    this.args = args;\n    this.resolve = resolve;\n}\n\nRPCCall.prototype.send = function (targetWindow, targetOrigin) {\n    targetWindow.postMessage(\n        {\n            rpcCall: {\n                id: this.id,\n                methodName: this.methodName,\n                args: this.args,\n            },\n        },\n        targetOrigin\n    );\n};\n\nRPCCall.prototype.respond = function (targetWindow, targetOrigin, value) {\n    targetWindow.postMessage(\n        {\n            rpcCall: {\n                id: this.id,\n                methodName: this.methodName,\n                args: this.args,\n                value: value,\n            },\n        },\n        targetOrigin\n    );\n};\n\nfunction IFrameRPC(targetWindow, targetOrigin) {\n    this._targetWindow = targetWindow;\n    this._targetOrigin = targetOrigin;\n    this._calls = {};\n    this._listeners = {};\n    this._currentCallId = 1;\n\n    if (this._targetOrigin !== '*' && this._targetOrigin[this._targetOrigin.length - 1] !== '/') {\n        this._targetOrigin += '/';\n    }\n\n    window.addEventListener('message', this._onMessage.bind(this));\n}\n\nIFrameRPC.prototype.call = function (methodName, args) {\n    return new Promise(function (resolve, reject) {\n        const callId = this._currentCallId++;\n        this._calls[callId] = new RPCCall(callId, methodName, args, resolve);\n        this._calls[callId].send(this._targetWindow, this._targetOrigin);\n    }.bind(this));\n};\n\nIFrameRPC.prototype.listen = function (methodName, handler) {\n    if (!this._listeners[methodName]) {\n        this._listeners[methodName] = [];\n    }\n    this._listeners[methodName].push(handler);\n};\n\nIFrameRPC.prototype.once = function (methodName) {\n    return new Promise(function (resolve, reject) {\n        if (!this._listeners[methodName]) {\n            this._listeners[methodName] = [];\n        }\n\n        const listeners = this._listeners[methodName];\n\n        listeners.push(function (rpcCall) {\n            listeners.splice(listeners.indexOf(this), 1);\n            resolve(rpcCall);\n        });\n    }.bind(this));\n};\n\nIFrameRPC.prototype._onMessage = function (event) {\n    let eventOrigin = event.origin;\n    if (eventOrigin[eventOrigin.length - 1] !== '/') {\n        eventOrigin = event.origin + '/';\n    }\n\n    if (this._targetOrigin !== '*' && eventOrigin !== this._targetOrigin) {\n        return;\n    }\n\n    if (event.source !== this._targetWindow) {\n        return;\n    }\n\n    if (!event.data.rpcCall) {\n        return;\n    }\n\n    const rpcCall = new RPCCall(\n        event.data.rpcCall.id, event.data.rpcCall.methodName, event.data.rpcCall.args\n    );\n    const listeners = this._listeners[event.data.rpcCall.methodName];\n\n    if (listeners) {\n        for (let i = 0, len = listeners.length; i < len; i++) {\n            listeners[i](rpcCall);\n        }\n    }\n\n    if (this._calls[event.data.rpcCall.id]) {\n        this._calls[event.data.rpcCall.id].resolve(event.data.rpcCall.value);\n        delete this._calls[event.data.rpcCall.id];\n    }\n};\n\n\n//# sourceURL=webpack://BASEAuth/./base_auth/templates/core/IFrameRPC.js?");

/***/ }),

/***/ "./base_auth/templates/main.js":
/*!*************************************!*\
  !*** ./base_auth/templates/main.js ***!
  \*************************************/
/*! exports provided: IFrameRPC, PopupView, WidgetView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _core_IFrameRPC_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/IFrameRPC.js */ \"./base_auth/templates/core/IFrameRPC.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"IFrameRPC\", function() { return _core_IFrameRPC_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _widget_popup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widget/popup.js */ \"./base_auth/templates/widget/popup.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"PopupView\", function() { return _widget_popup_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n/* harmony import */ var _widget_button_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./widget/button.js */ \"./base_auth/templates/widget/button.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"WidgetView\", function() { return _widget_button_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://BASEAuth/./base_auth/templates/main.js?");

/***/ }),

/***/ "./base_auth/templates/widget/button.js":
/*!**********************************************!*\
  !*** ./base_auth/templates/widget/button.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return WidgetView; });\n/* harmony import */ var _core_IFrameRPC_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/IFrameRPC.js */ \"./base_auth/templates/core/IFrameRPC.js\");\n\n\nfunction WidgetView(baseNodeApiUrl, $button, popupUrl, popupName, widgetOrigin) {\n    this._popupUrl = popupUrl;\n    this._popupName = popupName;\n    this._widgetOrigin = widgetOrigin;\n\n    this._baseNodeApi = new Base.NodeAPI(baseNodeApiUrl);\n    this._parent = window.parent;\n    this._parentOrigin = null;\n    this._parentRpc = null;\n\n    $button.on('click', this._onClickLogin.bind(this));\n}\n\nWidgetView.prototype._onClickLogin = function (event) {\n    const $button = $(event.target);\n    const popup = window.open(this._popupUrl, this._popupName, \"height=500, width=500\");\n    const popupRpc = new _core_IFrameRPC_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](popup, this._widgetOrigin);\n\n    popupRpc.once('submitMnenomic').then(function (rpcCall) {\n        $button.prop('disabled', true);\n        $button.text('Loading...');\n        return this._login(rpcCall.args[0]);\n    }.bind(this)).then(function () {\n        $button.text('Logged in!');\n    });\n    popup.focus();\n};\n\nWidgetView.prototype._login = function (mnemonic) {\n    const parentRpc = new _core_IFrameRPC_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this._parent, '*');\n    return parentRpc.call('getOrigin', []).then(function (origin) {\n        this._parentOrigin = origin;\n        this._parentRpc = new _core_IFrameRPC_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this._parent, this._parentOrigin);\n    }.bind(this)).then(function () {\n        return this._baseNodeApi.accountManager.checkAccount(mnemonic);\n    }.bind(this)).then(\n        function (account) {\n            return account;\n        },\n        function (response) {\n            if (response.status == 404) {\n                return this._baseNodeApi.accountManager.registration(mnemonic);\n            }\n        }.bind(this)\n    ).then(function (account) {\n        this._parentRpc.call('onLogin', [account]);\n        this._listen();\n    }.bind(this));\n};\n\nWidgetView.prototype._listen = function () {\n    this._parentRpc.listen('offerManager.getAllOffers', this._getAllOffers.bind(this));\n    this._parentRpc.listen('profileManager.getData', this._getData.bind(this));\n    this._parentRpc.listen('profileManager.updateData', this._updateData.bind(this));\n};\n\nWidgetView.prototype._respond = function (rpcCall, response) {\n    rpcCall.respond(this._parent, this._parentOrigin, response);\n};\n\nWidgetView.prototype._getAllOffers = function (rpcCall) {\n    this._baseNodeApi.offerManager.getAllOffers().then(this._respond.bind(this, rpcCall));\n};\n\nWidgetView.prototype._getData = function (rpcCall) {\n    this._baseNodeApi.profileManager.getData().then(this._respond.bind(this, rpcCall));\n};\n\nWidgetView.prototype._updateData = function (rpcCall) {\n    const dataObj = rpcCall.args[0];\n    const dataMap = new Map(Object.keys(dataObj).map(key => [key, dataObj[key]]));\n\n    this._baseNodeApi.profileManager.updateData(dataMap).then(this._respond.bind(this, rpcCall));\n};\n\n\n//# sourceURL=webpack://BASEAuth/./base_auth/templates/widget/button.js?");

/***/ }),

/***/ "./base_auth/templates/widget/popup.js":
/*!*********************************************!*\
  !*** ./base_auth/templates/widget/popup.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return PopupView; });\n/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid/v4 */ \"./node_modules/uuid/v4.js\");\n/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _core_IFrameRPC__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/IFrameRPC */ \"./base_auth/templates/core/IFrameRPC.js\");\n\n\n\nclass PopupView {\n    constructor(widgetOrigin, $inputMnemonic, $buttonSignup, $buttonSignin) {\n        this.widgetOrigin = widgetOrigin;\n        this.widgetRpc = new _core_IFrameRPC__WEBPACK_IMPORTED_MODULE_1__[\"default\"](window.opener, widgetOrigin);\n\n        this.$inputMnemonic = $inputMnemonic;\n        this.$buttonSignup = $buttonSignup;\n        this.$buttonSignin = $buttonSignin;\n\n        this.$buttonSignup.on('click', this._onClickSignin.bind(this));\n        this.$buttonSignin.on('click', this._onClickSignin.bind(this));\n    }\n\n    _onClickSignin() {\n        const mnemonic = this._parseMnemonic();\n\n        if (!mnemonic) {\n            return;\n        }\n\n        this.widgetRpc.call('submitMnenomic', [mnemonic]);\n        window.close();\n    }\n\n    _parseMnemonic() {\n        return this.$inputMnemonic.val();\n    }\n}\n\n\n//# sourceURL=webpack://BASEAuth/./base_auth/templates/widget/popup.js?");

/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\nvar byteToHex = [];\nfor (var i = 0; i < 256; ++i) {\n  byteToHex[i] = (i + 0x100).toString(16).substr(1);\n}\n\nfunction bytesToUuid(buf, offset) {\n  var i = offset || 0;\n  var bth = byteToHex;\n  return bth[buf[i++]] + bth[buf[i++]] +\n          bth[buf[i++]] + bth[buf[i++]] + '-' +\n          bth[buf[i++]] + bth[buf[i++]] + '-' +\n          bth[buf[i++]] + bth[buf[i++]] + '-' +\n          bth[buf[i++]] + bth[buf[i++]] + '-' +\n          bth[buf[i++]] + bth[buf[i++]] +\n          bth[buf[i++]] + bth[buf[i++]] +\n          bth[buf[i++]] + bth[buf[i++]];\n}\n\nmodule.exports = bytesToUuid;\n\n\n//# sourceURL=webpack://BASEAuth/./node_modules/uuid/lib/bytesToUuid.js?");

/***/ }),

/***/ "./node_modules/uuid/lib/rng-browser.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/rng-browser.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Unique ID creation requires a high quality random # generator.  In the\n// browser this is a little complicated due to unknown quality of Math.random()\n// and inconsistent support for the `crypto` API.  We do the best we can via\n// feature-detection\n\n// getRandomValues needs to be invoked in a context where \"this\" is a Crypto implementation.\nvar getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||\n                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));\nif (getRandomValues) {\n  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto\n  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef\n\n  module.exports = function whatwgRNG() {\n    getRandomValues(rnds8);\n    return rnds8;\n  };\n} else {\n  // Math.random()-based (RNG)\n  //\n  // If all else fails, use Math.random().  It's fast, but is of unspecified\n  // quality.\n  var rnds = new Array(16);\n\n  module.exports = function mathRNG() {\n    for (var i = 0, r; i < 16; i++) {\n      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;\n      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;\n    }\n\n    return rnds;\n  };\n}\n\n\n//# sourceURL=webpack://BASEAuth/./node_modules/uuid/lib/rng-browser.js?");

/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var rng = __webpack_require__(/*! ./lib/rng */ \"./node_modules/uuid/lib/rng-browser.js\");\nvar bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ \"./node_modules/uuid/lib/bytesToUuid.js\");\n\nfunction v4(options, buf, offset) {\n  var i = buf && offset || 0;\n\n  if (typeof(options) == 'string') {\n    buf = options === 'binary' ? new Array(16) : null;\n    options = null;\n  }\n  options = options || {};\n\n  var rnds = options.random || (options.rng || rng)();\n\n  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n  rnds[6] = (rnds[6] & 0x0f) | 0x40;\n  rnds[8] = (rnds[8] & 0x3f) | 0x80;\n\n  // Copy bytes to buffer, if provided\n  if (buf) {\n    for (var ii = 0; ii < 16; ++ii) {\n      buf[i + ii] = rnds[ii];\n    }\n  }\n\n  return buf || bytesToUuid(rnds);\n}\n\nmodule.exports = v4;\n\n\n//# sourceURL=webpack://BASEAuth/./node_modules/uuid/v4.js?");

/***/ })

/******/ });
});