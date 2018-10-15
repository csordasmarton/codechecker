var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var helpers = require('./helpers');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');

const METADATA = {
  'SERVER_HOST': null,
  'SERVER_PORT': 80,
  'API_VERSION': JSON.stringify('6.1')
};

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
            options: {
              silent: true,
              configFileName: helpers.root('src', 'tsconfig.json')
            }
          },
          'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/,
        use: 'url-loader?name=assets/images/[name].[ext]'
      },
      /*
      * Bootstrap 4 loader
      */
      {
        test: /bootstrap\/dist\/js\/umd\//,
        use: 'imports-loader?jQuery=jquery'
      },
      /*
      * Font loaders, required for font-awesome-sass-loader and bootstrap-loader
      */
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff?name=assets/fonts/[name].[ext]"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/fonts/[name].[ext]"
            }
          }
        ]
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
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader?sourceMap']
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        use: 'raw-loader'
      }
    ]
  },

  optimization: {
    runtimeChunk: "single", // enable "runtime" chunk
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        },
        thrift: {
          test: /[\\/]api[\\/]/,
          name: "thrift-api",
          chunks: "all"
        }
      }
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'API_VERSION': METADATA.API_VERSION
      }
    }),

    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['app', 'vendor', 'polyfills']
    // }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    new CopyWebpackPlugin([
      { from: 'src/assets/images', to: 'assets/images' }
    ]),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Popper: ['popper.js', 'default'],
      "window.Popper" : 'popper.js',
      Tether: "tether",
      "window.Tether": "tether",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Util: "exports-loader?Util!bootstrap/js/dist/util"
    })
  ]
};

