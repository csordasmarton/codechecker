var webpack = require('webpack');
var webpackMerge = require('webpack-merge');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const METADATA =  webpackMerge(commonConfig.metadata, {
  'SERVER_HOST': null,
  'SERVER_PORT': null
});

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js', '.scss'],
    alias: {
      'thrift': 'thrift/lib/nodejs/lib/thrift/browser.js',
      '@cc/shared': helpers.root('api'),
      '@cc/authentication': helpers.root('api', 'codeCheckerAuthentication_v6'),
      '@cc/db-access': helpers.root('api', 'codeCheckerDBAccess_v6'),
      '@cc/product-management': helpers.root('api', 'codeCheckerProductManagement_v6')
    }
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('src', 'tsconfig.json') }
          },
          'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff?name=assets/fonts/[name].[ext]"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "file-loader?name=assets/fonts/[name].[ext]"
      },
      {
        test: /\.scss$/,
        use: [
          'to-string-loader',
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [helpers.root('src')]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        use: 'raw-loader'
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        use: 'raw-loader'
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'SERVER_HOST': METADATA.SERVER_HOST,
        'SERVER_PORT': METADATA.SERVER_PORT,
        'API_VERSION': METADATA.API_VERSION,
      }
    }),

    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};

