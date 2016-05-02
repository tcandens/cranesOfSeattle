import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';
import store from './redux/store';
import {syncHistoryWithStore} from 'react-router-redux';
import makeRoutes from './routes';
import Root from 'containers/root';

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
