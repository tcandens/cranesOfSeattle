module.exports = config => {
  config.set({
    frameworks: ['mocha'],
    browsers: ['Chrome'],
    files: [
      'test/index.js',
    ],
    preprocessors: {
      'test/**/*': ['webpack', 'sourcemap'],
    },
    reporters: ['spec'],
    plugins: [
      require('karma-webpack'),
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
    ],
    webpack: require('./webpack/test.config.js'),
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
