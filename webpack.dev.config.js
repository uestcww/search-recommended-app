const path = require('path');
const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const webpackBaseConfig = require('./webpack.base.config.js');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const merge = require('webpack-merge');

const webpackDevConfig = merge(webpackBaseConfig, {
    devtool: "cheap-module-eval-source-map",
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
        new webpack.DefinePlugin({
            'process.env.API_ENV': '"development"'
        }),
        new HtmlwebpackPlugin({
            title: '嵌入式实时计算',
            filename: 'index.html',
            template: path.resolve(SRC_PATH, 'templates', 'index.html')
        }),
        new OpenBrowserPlugin({
            url: "http://localhost:8080/#/homePage"
        }),
    ]
});
module.exports = webpackDevConfig;