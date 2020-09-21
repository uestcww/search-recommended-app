const path = require('path');
const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const baseConfig = require('./webpack.base.config.js');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const prodConfig = merge(baseConfig, {
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                API_ENV:'"production"',
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            output: {
                comments: false,
            },
            compress: {
                warnings: false
            }
        }),
        new HtmlwebpackPlugin({
            title: '图书馆书目借阅系统',
            filename: 'index.html',
            template: path.resolve(SRC_PATH, 'templates', 'index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeAttributeQuotes: true
            }
        })
    ]
});
module.exports = prodConfig;