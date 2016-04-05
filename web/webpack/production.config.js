const assign = require('lodash/assign');
const defaults = require('lodash/defaultsDeep');
const merge = require('lodash/merge');
const webpack = require('webpack');
const path = require('path');
const devConfig = require('./development.config');

const config = assign({}, devConfig, {
  devtool: 'source-map',
  entry: [
    './src/index.js'
  ],
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
});

merge(config, {
  resolve: {
    alias: {
      'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
      // 'react': path.resolve('./node_modules/react/dist/react.min.js'),
      // 'react-dom': path.resolve('./node_modules/react-dom/dist/react-dom.min.js')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.resolve('src')
      }
    ]
  }
});


module.exports = config;
