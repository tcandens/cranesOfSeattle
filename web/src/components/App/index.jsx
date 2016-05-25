import React from 'react';
import {browserHistory} from 'react-router';
import store from '../redux/store';
import {syncHistoryWithStore} from 'react-router-redux';
import makeRoutes from '../routes';
import Root from 'components/Root';

const routes = makeRoutes(store);
const history = syncHistoryWithStore(browserHistory, store);

export default function App() {
  return (
    <Root
      history={history}
      routes={routes}
      store={store}
    />
  );
}
