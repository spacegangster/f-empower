/**
 * Sample webpack config to show explore minification capabilities of the module
 */
const webpack = require('webpack')

module.exports = {
    entry: './f-empower.js',
    output: {
        filename: 'f-empower.umd.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ],
            },
        ]
    },
}
