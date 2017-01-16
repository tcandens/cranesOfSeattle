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
        cacheDirectory: false,
      },
    },
    {
      test: /\.css$/,
      loader: 'style!css',
    },
    {
      test: /\.styl$/,
      loader: (isDeveloping ?
        'style!css!stylus' :
        ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
      ),
      include: path.join(ROOT, 'src'),
    },
    {
      test: /\.json$/,
      loaders: ['json'],
    },
    {
      test: /\.(jpe?g|ico|png)$/,
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
