import React, {Component, PropTypes} from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-router';

import 'styles/index.styl';

export default class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.element.isRequired,
    store: PropTypes.object.isRequired
  };

  get content () {
    const {routes, history} = this.props;
    return (
      <Router history={history}>
        {routes}
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
