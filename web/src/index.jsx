import React from 'react';
import {AppContainer} from 'react-hot-loader';
import App from 'components/App';
import {render} from 'react-dom';
import FastClick from 'fastclick';

const AppRoot = document.getElementById('root');

render((
  <AppContainer>
    <App />
  </AppContainer>
), AppRoot
);

window.addEventListener('load', () => {
  FastClick.attach(document.body);
});

if (module.hot) {
  module.hot.accept('components/App', () => {
    const NextApp = require('components/App').default; // eslint-disable-line
    render((
      <AppContainer>
        <NextApp />
      </AppContainer>
    ), AppRoot);
  });
}
