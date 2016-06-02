module.exports = {
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js/,
        loaders: [
          'babel',
        ],
        exclude: /(node_modules)/,
      },
      {
        test: /.json$/,
        loaders: ['json'],
      },
      {
        test: /.(css|styl)$/,
        loaders: ['null'],
      },
    ],
  },
  resolve: {
    extensions: [
      '', '.js', '.jsx',
    ],
    alias: require('./webpack.config.js').resolve.alias,
  },
  node: {
    fs: 'empty',
  },
  externals: {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
};
