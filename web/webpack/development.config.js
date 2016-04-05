const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve(process.cwd());

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index.js'
  ],
  output: {
    path: path.join(ROOT, 'dist'),
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      'mapbox-gl/css': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.css'),
      'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl-dev.js'),
      'protected': path.resolve(ROOT, 'protected.js'),
      'actions': path.resolve(ROOT, 'src/actions'),
      'components': path.resolve(ROOT, 'src/components'),
      'containers': path.resolve(ROOT, 'src/containers'),
      'decorators': path.resolve(ROOT, 'src/decorators'),
      'lib': path.resolve(ROOT, 'src/lib'),
      'assets': path.resolve(ROOT, './assets')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.resolve(ROOT, 'src')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.styl$/,
        loaders: ['style', 'css', 'stylus'],
        include: path.join(ROOT, 'src')
        // loader: 'style!css!stylus?resolve url'
      },
      {
        test: /\.json$/,
        loaders: ['json']
      },
      {
        test: /\.(jpe?g)$/,
        loader: 'url?.[ext]&mimetype=image/jpeg',
        include: path.join(ROOT, 'assets')
        // query: {limit: 10240}
      }
    ]
  }
};
