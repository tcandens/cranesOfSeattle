import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';
import configureStore from './configureStore';
import makeRoutes from './routes';
import Root from 'containers/root';

const store = configureStore();
const routes = makeRoutes(store);

ReactDOM.render(
  <Root
    history={browserHistory}
    routes={routes}
    store={store}
  />, document.getElementById('root')
);
