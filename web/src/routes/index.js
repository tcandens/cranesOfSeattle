import React from 'react';
import {Route, IndexRoute} from 'react-router';

import Entry from 'components/entry';
import MapLayout from 'layouts/map';

export default (store) => {
  return (
    <Route path='/' component={MapLayout}>
      <IndexRoute component={Entry} />
      <Route path='map' component={null} />
    </Route>
  );
};
