const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.js');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3000, 'localhost', (error, result) => {
    if (error) {
      console.log(error);
    }
    console.log('Listening to Webpack-Dev-Server at localhost:3000');
  });
