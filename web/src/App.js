import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import store from './redux/store';
import {syncHistoryWithStore} from 'react-router-redux';
import makeRoutes from './routes';
import Root from 'containers/root';

const routes = makeRoutes(store);
const history = syncHistoryWithStore(browserHistory, store);

export default class App extends Component {
  render = () => {
    return (
      <Root
        history={history}
        routes={routes}
        store={store}
      />
    );
  }
}
