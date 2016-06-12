import React from 'react';
import {Route, IndexRoute} from 'react-router';

import MainLayout from 'layouts/Main';
import Entry from 'components/Entry';

import {
  resetReportState,
} from 'ducks/reports';

export default function CreateRoutes(store) {
  function requireAuth(nextState, replace) {
    // Try to wait for rehydration of redux state
    // If isDeveloping, return
    const state = store.getState();
    const {isAuthenticated} = state.user;
    if (!isAuthenticated) {
      replace({
        pathname: '/',
        state: {nextPathname: nextState.location.pathname},
      });
    }
  }
  function resetReportOnExit() {
    store.dispatch(resetReportState());
  }

  return (
    <Route path="/" component={MainLayout}>
      <IndexRoute component={Entry} />
      <Route path="explore"
        getComponent={(next, cb) => {
          require.ensure([], require => {
            cb(null, require('containers/Explore').default);
          });
        }}
      />
      <Route path="report"
        onEnter={requireAuth}
        onLeave={resetReportOnExit}
        getComponent={(next, cb) => {
          require.ensure([], require => {
            cb(null, require('containers/Report').default);
          });
        }}
      />
    </Route>
  );
}
