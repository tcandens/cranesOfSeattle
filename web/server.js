const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.development.js');

const PORT = 9000;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(PORT, '0.0.0.0', (error, result) => {
    if (error) {
      console.log(error);
    }
    console.log('Listening to Webpack-Dev-Server at localhost:' + PORT);
  });
