const webpack = require('webpack');
const path = require('path');
const aliases = require('./aliases');
const loaders = require('./loaders');
const merge = require('lodash/merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
        screw_ie8: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Cranes of Seattle',
      filename: 'index.html'
    })
  ],
  resolve: {
    alias: merge(aliases, {
      'mapbox-gl': path.resolve(process.cwd(), './node_modules/mapbox-gl/dist/mapbox-gl.js')
    })
  },
  module: {
    loaders: loaders
  }
};
