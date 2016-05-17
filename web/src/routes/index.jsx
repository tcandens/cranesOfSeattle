import React from 'react';
import { Route, IndexRoute } from 'react-router';

import MainLayout from 'layouts/Main';
import Entry from 'components/Entry';
import Report from 'containers/Report';

export default function CreateRoutes(store) {
  const requireAuth = function requireAuth(nextState, replace) {
    // Try to wait for rehydration of redux state
    // If isDeveloping, return
    const state = store.getState();
    const { isAuthenticated } = state.user;
    if (!isAuthenticated) {
      replace({
        pathname: '/',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  };

  return (
    <Route path='/' component={MainLayout}>
      <IndexRoute component={Entry} />
      <Route path='map' component={Report} />
      <Route path='report' component={Report} onEnter={requireAuth} />
    </Route>
  );
}
