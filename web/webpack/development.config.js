const path = require('path');
const webpack = require('webpack');
const ROOT = path.resolve(process.cwd());
const aliases = require('./aliases');
const loaders = require('./loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index.js'
  ],
  output: {
    path: path.join(ROOT, 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/dist/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT, 'templates', 'index.jade'),
      title: 'Cranes of Seattle',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: aliases
  },
  module: {
    loaders: loaders
  }
};
