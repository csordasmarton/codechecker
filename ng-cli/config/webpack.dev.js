var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

const CC_SERVER_PORT = process.env.SERVER_HOST || 8001;
const CC_SERVER_HOST = process.env.SERVER_PORT || 'http://localhost';

const SERVICE_ENDPOINTS = ['Authentication', 'Products', 'CodeCheckerService'];

// Host should be set explicitly to `localhost` because thrift will use
// the value of `window.location.host` which will contain port number by default
// on local host which cause invalid url format.
const METADATA = webpackMerge(commonConfig.METADATA, {
  'SERVER_HOST': null,
  'SERVER_PORT': null,
});

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new MiniCssExtractPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        'SERVER_HOST': METADATA.SERVER_HOST,
        'SERVER_PORT': METADATA.SERVER_PORT
      }
    }),
  ],

  devServer: {
    historyApiFallback: true,
    proxy: [{
      context: SERVICE_ENDPOINTS.map(endpoint => `**/${endpoint}`),
      target: CC_SERVER_HOST + ':' + CC_SERVER_PORT,
      changeOrigin: true,
      secure: false
    }]
  }
});
