const assign = require('lodash/assign');
const webpack = require('webpack');
const config = require('./development.config');

module.exports = assign(config, {
  devtool: '#source-maps',
  entry: [
    './src/index.js'
  ],
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
});
