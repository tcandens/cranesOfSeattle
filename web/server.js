const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack/development.config');
const compiler = webpack(config);
const app = express();

const isDeveloping = process.env.NODE_ENV !== 'production';

if (isDeveloping) {
  console.info('== Developing with HMR ==>');
  app.use(require('webpack-dev-middleware')(compiler, {
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    noInfo: true,
    publicPath: '/dist/'
  }));
  app.use(require('webpack-hot-middleware')(compiler, {
    reload: true
  }));
} else {
  console.info('== Production with Express Static ==>');
  const distPath = path.join(__dirname, 'dist');
  app.use('/dist', express.static(distPath));
}

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(9000, '0.0.0.0', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening with webpack compiler.');
});
