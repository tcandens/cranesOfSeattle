import React from 'react';
import {Route, IndexRoute} from 'react-router';

import MainLayout from 'layouts/main';
import Entry from 'components/entry';

export default (store) => {
  return (
    <Route path='/' component={MainLayout}>
      <IndexRoute component={Entry} />
      <Route path='map' getComponent={(location, callback) => {
        require.ensure([], require => {
          callback(null, require('containers/map').default);
        });
      }} />
    </Route>
  );
};
