module.exports = config => {
  config.set({
    frameworks: ['mocha'],
    browsers: ['Chrome'],
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
      'karma-chrome-launcher',
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
