const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      'mapbox-gl/css': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.css'),
      'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl-dev.js'),
      'protected': path.resolve(__dirname, 'protected.js'),
      'actions': path.resolve(__dirname, 'src/actions'),
      'components': path.resolve(__dirname, 'src/components'),
      'containers': path.resolve(__dirname, 'src/containers'),
      'decorators': path.resolve(__dirname, 'src/decorators'),
      'lib': path.resolve(__dirname, 'src/lib')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.styl$/,
        loaders: ['style', 'css', 'stylus']
      },
      {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  }
};
