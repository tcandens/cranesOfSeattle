import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';
import configureStore from './redux/configureStore';
import {syncHistoryWithStore} from 'react-router-redux';
import makeRoutes from './routes';
import Root from 'containers/root';

const store = configureStore();
const routes = makeRoutes(store);
const history = syncHistoryWithStore(browserHistory, store);

import 'styles';

ReactDOM.render((
  <Root
    history={history}
    routes={routes}
    store={store}
  ></Root>), document.getElementById('root')
);
