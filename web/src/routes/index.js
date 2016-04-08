import React from 'react';
import {Route, IndexRoute} from 'react-router';

import MainLayout from 'layouts/main';
import Entry from 'components/entry';
import MapContainer from 'containers/map';

const requireComponent = (path) => (location, callback) => {
  require.ensure([], require => {
    callback(null, require(path));
  });
};

export default (store) => {
  return (
    <Route path='/' component={MainLayout}>
      <IndexRoute component={Entry} />
      <Route path='map' getComponent={requireComponent('containers/map')} />
    </Route>
  );
};
