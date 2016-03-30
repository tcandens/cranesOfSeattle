const path = require('path');
const app = require('express')();
const webpack = require('webpack');
const config = require('./webpack.development.js');

var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: '/dist/'
}));

app.use(require('webpack-hot-middleware')(compiler));

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
