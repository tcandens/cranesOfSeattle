const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/app.jsx'
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
  module: {
    loaders: [{
      test: /\.jsx$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }]
  }
};
