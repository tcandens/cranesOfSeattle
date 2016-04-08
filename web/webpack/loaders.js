const path = require('path');

const createLoaders = (ROOT) => {
  return [
    {
      test: /\.js$/,
      loaders: ['babel'],
      include: path.resolve(ROOT, 'src'),
      exclude: /(node_modules)/
    },
    {
      test: /\.css$/,
      loaders: ['style', 'css']
    },
    {
      test: /\.styl$/,
      loaders: ['style', 'css', 'stylus'],
      include: path.join(ROOT, 'src')
    },
    {
      test: /\.json$/,
      loaders: ['json']
    },
    {
      test: /\.(jpe?g)$/,
      loader: 'url?.[ext]&mimetype=image/jpeg',
      include: path.join(ROOT, 'assets')
    },
    {
      test: /\.jade$/,
      loaders: ['jade'],
      include: path.join(ROOT, 'templates')
    }
  ];
};

module.exports = createLoaders;
