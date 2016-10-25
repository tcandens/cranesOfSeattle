const path = require('path');
const express = require('express');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
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
      colors: true,
    },
  }).listen(port, (error, result) => {
    if (error) {
      return console.log(error);
    }
    console.info('== Developing with HMR ==>');
  });
} else {
  app.set('views', './templates');
  app.set('view engine', 'jade');
  app.get('/', (req, res) => {
    const Entry = require('./src/components/Entry.jsx').default;
    const Navigation = require('./src/components/Navigation.jsx').default;
    const App = () => (
      <main className="l-main">
        <Entry />
        <Navigation />
      </main>
    );
    const appString = ReactDOMServer.renderToString(<App />);
    res.render('ssr', {
      content: appString,
    });
  });
  // Match all routes except /assets*
  app.get(/^((?!\/assets).)*$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
  const distPath = path.join(__dirname, 'dist/assets');
  app.use('/assets', express.static(distPath));
  app.listen(9000, '0.0.0.0', error => {
    if (error) {
      console.log(err);
      return;
    }
    console.info('== Production with Express Static ==>');
  });
}
