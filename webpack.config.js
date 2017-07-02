const webpack = require('webpack');
const path = require('path');

const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

module.exports = [
    {
        context: srcPath,
        entry: {
            'index': './index.js'
        },
        output: {
            path: distPath,
            filename: './bundle.js'
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    include: [
                        srcPath
                    ],
                    loader: 'eslint-loader',
                },
                {
                    test: /\.js$/,
                    include: [
                        srcPath
                    ],
                    loader: 'babel-loader'
                }
            ]
        },
        plugins: [
            new webpack.optimize.ModuleConcatenationPlugin()
        ]
    }
];
