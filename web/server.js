const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack/webpack.config');
const compiler = webpack(config);
const app = express();

const isDeveloping = process.env.NODE_ENV !== 'production';

if (isDeveloping) {
  console.info('== Developing with HMR ==>');
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: '/dist/',
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    noInfo: true,
    silent: true,
    stats: {
      colors: true
    }
  }));
  app.use(require('webpack-hot-middleware')(compiler, {
    reload: true
  }));

  app.get('*', (req, res, next) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (error, result) => {
      if (error) {
        return next(error);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.send();
    });
  });
} else {
  console.info('== Production with Express Static ==>');
  const distPath = path.join(__dirname, 'dist');
  app.use('/dist', express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}


app.listen(9000, '0.0.0.0', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening with webpack compiler.');
});
