const path = require('path');
const express = require('express');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack/webpack.config');
const compiler = webpack(config);
const app = express();
const port = 9000;

const isDeveloping = process.env.NODE_ENV !== 'production';

if (isDeveloping) {
  new WebpackDevServer(compiler, {
    publicPath: '/',
    hot: true,
    historyApiFallback: true,
    noInfo: true,
    stats: {
      asssets: false,
      cachedAssets: false,
      cached: false,
      colors: true
    }
  }).listen(port, function(error, result) {
    if (error) {
      return console.log(error)
    }
    console.info('== Developing with HMR ==>');
  });
} else {
  const distPath = path.join(__dirname, 'dist');
  app.use('/dist', express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
  app.listen(9000, '0.0.0.0', function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.info('== Production with Express Static ==>');
  });
}
