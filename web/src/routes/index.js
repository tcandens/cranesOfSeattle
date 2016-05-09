import React from 'react';
import {Route, IndexRoute} from 'react-router';

import MapLayout from 'layouts/map';
import Entry from 'layouts/entry';
import Report from 'containers/report';
import Login from 'containers/login';

const Cranes = () => {};
const CraneInfo = () => {};

export default (store) => {
  const requireAuth = function requireAuth(nextState, replace) {
    // Try to wait for rehydration of redux state
    // If isDeveloping, return
    const state = store.getState();
    const {isAuthenticated} = state.user;
    if (!isAuthenticated) {
      replace({
        pathname: '/',
        state: {nextPathname: nextState.location.pathname}
      });
    }
  };

  return (
    <Route path='/' component={MapLayout}>
      <IndexRoute component={Entry} />
      <Route path='cranes' component={Cranes}>
        <Route path=':id' component={CraneInfo} />
      </Route>
      <Route path='map' component={Report} />
      <Route path='report' component={Report} onEnter={requireAuth} />
    </Route>
  );
};
