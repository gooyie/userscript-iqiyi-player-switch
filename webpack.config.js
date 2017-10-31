const webpack = require('webpack');
const path = require('path');

const pkg = require('./package');
const meta = require('./src/meta');
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
            filename: `./${pkg.name}.user.js`
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
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.BannerPlugin({
                banner: meta,
                raw: true,
                entryOnly: true,
            }),
        ]
    }
];
