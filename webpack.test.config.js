const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config.js');
const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');

const webpackTestConfig = merge(webpackBaseConfig, {
    devServer: {
        hot: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        port: '8088',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.API_ENV': '"test"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
        }),
        new HtmlwebpackPlugin({
            title: '嵌入式实时计算',
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
        }),
    ]
});
module.exports = webpackTestConfig;