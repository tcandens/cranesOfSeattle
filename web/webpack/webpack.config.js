const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('lodash/merge');
const createAliasesFrom = require('./helpers').alias;
const getLoaders = require('./loaders');

require('dotenv').config();

const ROOT = path.resolve(process.cwd());
const isDeveloping = process.env.NODE_ENV !== 'production';
const isTesting = process.env.NODE_ENV === 'test';

const getEntry = (isDeveloping) => {
  const entry = [];
  if (isDeveloping) {
    entry.push(
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server'
    );
  }
  entry.push('./src/index.jsx');
  return entry;
};

const getPlugins = (isDeveloping) => {
  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT, 'templates', 'index.jade'),
      title: 'Cranes of Seattle',
      filename: 'index.html',
    }),
  ];
  const defaultGlobals = {
    GOOGLE_CLIENT_ID: JSON.stringify(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: JSON.stringify(process.env.GOOGLE_CLIENT_SECRET),
    MAPBOX_TOKEN: JSON.stringify(process.env.MAPBOX_TOKEN),
  };
  if (isDeveloping) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin(defaultGlobals)
    );
  } else {
    plugins.push(
      new webpack.DefinePlugin(merge(defaultGlobals, {
        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
        },
      })),
      new webpack.optimize.DedupePlugin(),
      new ExtractTextPlugin('assets/styles.css'),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false,
          screw_ie8: true,
        },
      })
    );
  }
  return plugins;
};

module.exports = {
  devtool: isDeveloping ? 'eval' : 'source-map',
  entry: getEntry(isDeveloping),
  output: {
    path: path.join(ROOT, 'dist'),
    filename: 'assets/[name].js',
    chunkFilename: 'assets/[id].chunk.js',
    publicPath: isDeveloping ? '/' : '/',
  },
  plugins: getPlugins(isDeveloping),
  resolve: {
    extensions: [
      '', '.js', '.jsx', '.styl',
    ],
    alias: merge(
      {
        'mapbox-gl/css': path.resolve(ROOT, './node_modules/mapbox-gl/dist/mapbox-gl.css'),
        'mapbox-gl/js': ((isTesting || isDeveloping) ?
          path.resolve(ROOT, './node_modules/mapbox-gl/dist/mapbox-gl-dev.js') :
          path.resolve(ROOT, './node_modules/mapbox-gl/dist/mapbox-gl.js')
        ),
      },
      createAliasesFrom(path.resolve(ROOT, 'src')).to([
        'containers',
        'components',
        'decorators',
        'layouts',
        'lib',
        'styles',
      ]),
      createAliasesFrom(path.resolve(ROOT)).to([
        'assets',
      ]),
      createAliasesFrom(path.resolve(ROOT, 'src', 'redux')).to([
        'ducks',
      ])
    ),
  },
  module: {
    loaders: getLoaders(ROOT, isDeveloping),
  },
  stylus: {
    use: [
      require('poststylus')(['autoprefixer']),
    ],
  },
};
