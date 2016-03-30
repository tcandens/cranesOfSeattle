const webpack = require('webpack');
const path = require('path');
const defaults = require('lodash.defaults');
const config = require('./webpack.development.js');

module.exports = defaults(config, {
  devtool: 'source-maps',
  entry: [
    './src/index.js'
  ]
});
