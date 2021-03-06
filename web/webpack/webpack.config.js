const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('lodash/merge');
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
    new FaviconsWebpackPlugin({
      logo: './assets/favicon.png',
      prefix: 'assets/favicons/',
      inject: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT, 'templates', 'index.jade'),
      inject: false,
      title: 'Cranes of Seattle',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(ROOT, 'src/manifest.json'),
        to: path.join(ROOT, 'dist/manifest.json'),
      },
    ]),
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
      new SWPrecacheWebpackPlugin({
        cacheId: 'seattle-cranes',
        filepath: path.join(ROOT, 'dist/assets', 'sw-cache.js'),
      }),
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
    alias: {
      'mapbox-gl/css': path.resolve(ROOT, './node_modules/mapbox-gl/dist/mapbox-gl.css'),
      'mapbox-gl/js': ((isTesting || isDeveloping) ?
        path.resolve(ROOT, './node_modules/mapbox-gl/dist/mapbox-gl-dev.js') :
        path.resolve(ROOT, './node_modules/mapbox-gl/dist/mapbox-gl.js')
      ),
    },
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
