// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

var webpackConfig = require('./config/webpack.test');

module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      { pattern: './karma-test-shim.js', watched: false }
    ],

    preprocessors: {
      './karma-test-shim.js': ['webpack']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.DEBUG,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true
  });
};
