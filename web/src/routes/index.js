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
    const state = store.getState();
    const {id} = state.user;
    if (!id) {
      replace({
        pathname: '/',
        state: {nextPathname: nextState.location.pathname}
      });
    }
  }
  return (
    <Route path='/' component={MapLayout}>
      <IndexRoute component={Entry} />
      <Route path='cranes' component={Cranes}>
        <Route path=':id' component={CraneInfo} />
      </Route>
      <Route path='report' component={Report} onEnter={requireAuth} />
    </Route>
  );
};
