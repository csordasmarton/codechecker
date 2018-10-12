var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const METADATA = webpackMerge(commonConfig.metadata, {
  'SERVER_HOST': process.env.SERVER_HOST || null,
  'SERVER_PORT': process.env.SERVER_PORT || null
});

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  mode: 'production',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'SERVER_HOST': METADATA.SERVER_HOST,
        'SERVER_PORT': METADATA.SERVER_PORT
      }
    }),

    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ]
});

