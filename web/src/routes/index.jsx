import React from 'react';
import {Route, IndexRoute} from 'react-router';

import MainLayout from '../layouts/Main';
import LoginContainer from '../containers/Login';
import Entry from '../components/Entry';

import {
  resetReportState,
} from '../state/ducks/reports';

import {
  beginLoading,
  finishLoading,
} from '../state/ducks/map';

export default function CreateRoutes(store) {
  function requireAuth(nextState, replace) {
    // Try to wait for rehydration of redux state
    // If isDeveloping, return
    const state = store.getState();
    const {isAuthenticated} = state.user;
    if (!isAuthenticated) {
      replace({
        pathname: '/login',
        state: {nextPathname: nextState.location.pathname},
      });
    }
  }
  function resetReportOnExit() {
    store.dispatch(resetReportState());
    store.dispatch(finishLoading());
  }
  function setIsLoading() {
    store.dispatch(beginLoading());
  }

  return (
    <Route path="/" component={MainLayout}>
      <IndexRoute component={Entry} />
      <Route path="login" component={LoginContainer}/>
      <Route path="report"
        onEnter={setIsLoading}
        onLeave={resetReportOnExit}
        getComponent={(next, cb) => {
          require.ensure([], require => {
            cb(null, require('../containers/Report').default);
          });
        }}
      />
      <Route path="user"
        getComponent={(next, cb) => {
          require.ensure([], require => {
            cb(null, require('../containers/User').default);
          });
        }}
      >
        <Route
          path="/user/:userId"
          getComponent={(next, cb) => {
            require.ensure([], require => {
              cb(null, require('../components/UserProfile').default);
            });
          }}
        />
      </Route>
    </Route>
  );
}
