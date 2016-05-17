import React, {Component, PropTypes} from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-router';

import 'styles/index.styl';

export default class Root extends Component {
  get content() {
    const {routes, history, children} = this.props;
    return (
      <Router history={history} routes={routes}>
        {children}
      </Router>
    );
  }

  render = () => {
    const {store} = this.props;
    return (
      <Provider store={store}>
        {this.content}
      </Provider>
    );
  }
}

Root.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};
