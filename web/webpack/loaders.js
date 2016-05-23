const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const createLoaders = (ROOT, isDeveloping) => {
  return [
    {
      test: /\.jsx?$/,
      loader: 'babel',
      include: path.resolve(ROOT, 'src'),
      exclude: /(node_modules)/,
      query: {
        cacheDirectory: true,
      },
    },
    {
      test: /\.css$/,
      loader: (isDeveloping ?
        'style!css' :
        ExtractTextPlugin.extract('style', 'css')
      ),
    },
    {
      test: /\.styl$/,
      loader: 'style!css!stylus',
      include: path.join(ROOT, 'src'),
    },
    {
      test: /\.json$/,
      loaders: ['json'],
    },
    {
      test: /\.(jpe?g)$/,
      loader: 'file?name=assets/[name].[ext]',
    },
    {
      test: /\.svg$/,
      loader: 'file?name=assets/[name].[ext]',
    },
    {
      test: /\.jade$/,
      loaders: ['jade'],
      include: path.join(ROOT, 'templates'),
    },
  ];
};

module.exports = createLoaders;
