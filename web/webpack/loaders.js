const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const createLoaders = (ROOT, isDeveloping) => {
  return [
    {
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.resolve(ROOT, 'src'),
      exclude: /(node_modules)/,
    },
    {
      test: /\.css$/,
      loader: (isDeveloping ?
        'style!css' :
        ExtractTextPlugin.extract(['style', 'css'])
      ),
    },
    {
      test: /\.styl$/,
      loader: (isDeveloping ?
        'style!css!stylus' :
        ExtractTextPlugin.extract(['css', 'stylus'])
      ),
      include: path.join(ROOT, 'src'),
    },
    {
      test: /\.json$/,
      loaders: ['json'],
    },
    {
      test: /\.(jpe?g)$/,
      loader: 'url?.[ext]&mimetype=image/jpeg',
      include: path.join(ROOT, 'assets'),
    },
    {
      test: /\.jade$/,
      loaders: ['jade'],
      include: path.join(ROOT, 'templates'),
    },
    {
      test: /\.svg$/,
      loaders: ['url?.[ext]&mimetype=image/svg'],
      include: path.join(ROOT, 'assets'),
    },
  ];
};

module.exports = createLoaders;
