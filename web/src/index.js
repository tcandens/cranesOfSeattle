import React from 'react';
import {AppContainer} from 'react-hot-loader';
import App from './App';
import {render} from 'react-dom';

const AppRoot = document.getElementById('root');

render((
  <AppContainer>
    <App />
  </AppContainer>
), document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render((
      <AppContainer>
        <NextApp />
      </AppContainer>
    ), document.getElementById('root'));
  });
}
