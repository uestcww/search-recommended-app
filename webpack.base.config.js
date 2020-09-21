const path = require('path');
const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'packaging/dist');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devServer: {
        hot: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        port: '8088',
    },
    entry: {
        index: path.resolve(SRC_PATH, 'index.js')
    },
    output: {
        path: BUILD_PATH,
        filename: 'js/[name].[hash:5].js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loaders: ['babel-loader'],
                include: SRC_PATH,
                exclude: path.resolve(ROOT_PATH, 'node_modules')
            },
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader'],
                include: SRC_PATH,
                exclude: path.resolve(ROOT_PATH, 'node_modules')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("css-loader")
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("css-loader")
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'images/[name].[hash:5].[ext]',
                    },
                },
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("style.css"),
    ]
};