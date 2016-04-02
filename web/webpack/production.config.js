const defaults = require('lodash.defaults');
const webpack = require('webpack');
const config = require('./development.config');
const path = require('path');

module.exports = defaults(config, {
  devtool: '#source-maps',
  entry: [
    './src/index.js'
  ],
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
});
