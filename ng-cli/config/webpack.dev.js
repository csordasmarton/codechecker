var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

const METADATA = webpackMerge(commonConfig.METADATA, {
  'SERVER_HOST': JSON.stringify('localhost'),
  'SERVER_PORT': 8001,
});

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),

    new webpack.DefinePlugin({
      'SERVER_HOST': METADATA.SERVER_HOST,
      'SERVER_PORT': METADATA.SERVER_PORT,
      'ENV': JSON.stringify(ENV),
    }),
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});
