const path = require('path');

module.exports = (env) => (
    [
        {
            entry: './base_auth/templates/site.js',
            output: {
                path: path.join(__dirname, 'statics/js'),
                filename: 'site.js',
                library: 'BASEAuth',
                libraryTarget: 'umd2',
                umdNamedDefine: true,
            },
            resolve: {
                alias: {
                    settings: path.join(__dirname, 'base_auth', 'templates', `settings.${env}`),
                }
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
            resolve: {
                alias: {
                    settings: path.join(__dirname, 'base_auth', 'templates', `settings.${env}`),
                }
            },
        },
    ]
)
