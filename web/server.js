const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.development.js');
const compiler = webpack(config);
const app = express();

const isDeveloping = process.env.ENV !== 'production';

if (isDeveloping) {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: '/dist/'
  }));
  app.use(require('webpack-hot-middleware')(compiler));
} else {
  const staticPath = path.join(__dirname, 'dist');
  app.use('/dist', express.static(staticPath));
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(9000, '0.0.0.0', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening with webpack compiler.');
});
