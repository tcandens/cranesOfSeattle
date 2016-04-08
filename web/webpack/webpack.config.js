const path = require('path');
const webpack = require('webpack');
const getLoaders = require('./loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('lodash/merge');
const ROOT = path.resolve(process.cwd());

const isDeveloping = process.env.NODE_ENV !== 'production';

const createAliasesFrom = (root) => (names) => {
  return names.reduce((result, value) => {
    result[value] = path.resolve(root, value);
    return result;
  }, {});
};

const getEntry = (isDeveloping) => {
  const entry = [];
  if (isDeveloping) {
    entry.push('webpack-hot-middleware/client?reload=true');
  }
  entry.push('./src/index.js');
  return entry;
};

const getPlugins = (isDeveloping) => {
  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT, 'templates', 'index.jade'),
      title: 'Cranes of Seattle',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ];
  if (isDeveloping) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    );
  } else {
    plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false,
          screw_ie8: true
        }
      })
    );
  }
  return plugins;
};

module.exports = {
  devtool: isDeveloping ? 'cheap-module-eval-source-map' : 'source-map',
  entry: getEntry(isDeveloping),
  output: {
    path: path.join(ROOT, 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/dist/'
  },
  plugins: getPlugins(isDeveloping),
  resolve: {
    alias: merge({
      'mapbox-gl/css': path.resolve(ROOT, './node_modules/mapbox-gl/dist/mapbox-gl.css'),
      'mapbox-gl': path.resolve(ROOT, './node_modules/mapbox-gl/dist/mapbox-gl-dev.js')
    }, createAliasesFrom(path.resolve(ROOT, 'src'))([
      'actions',
      'containers',
      'components',
      'decorators',
      'layouts',
      'lib',
      'styles'
    ]), {
      'assets': path.resolve(ROOT, './assets'),
      'containers': path.resolve(process.cwd(), './src/containers')
    })
  },
  module: {
    loaders: getLoaders(ROOT)
  }
};
