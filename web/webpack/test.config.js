'use strict';

module.exports = {
  output: {
    libraryTarget: 'commonjs2',
  },
  modules: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css',
        ],
      },
    ],
  },
};
