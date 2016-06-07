module.exports = config => {
  config.set({
    frameworks: ['mocha'],
    browsers: ['PhantomJS'],
    files: [
      'test.context.js',
    ],
    preprocessors: {
      'test.context.js': [
        'webpack',
        'sourcemap',
        'sourcemap-writer',
        'coverage',
      ],
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      type: 'json',
      file: 'coverage-final.json',
      subdir: '.',
    },
    plugins: [
      'karma-phantomjs-launcher',
      'karma-webpack',
      'karma-mocha',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
      'karma-sourcemap-writer',
      'karma-coverage',
    ],
    webpack: require('./webpack/test.config.js'), // eslint-disable-line
    webpackMiddleware: {
      noInfo: true,
      quiet: true,
    },
  });
};
