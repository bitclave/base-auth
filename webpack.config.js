const path = require('path');

module.exports = [
    {
        entry: './base_auth/templates/main.js',
        output: {
            path: path.join(__dirname, 'statics/js'),
            filename: 'main.js',
            library: 'BASEAuth',
            libraryTarget: 'umd2',
            umdNamedDefine: true,
        },
    },
    {
        entry: './base_auth/templates/sdk.js',
        output: {
            path: path.join(__dirname, 'statics/js'),
            filename: 'sdk.js',
            library: 'BASEAuthSDK',
            libraryTarget: 'umd2',
            umdNamedDefine: true,
        },
    },
];
