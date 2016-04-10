import React from 'react';
import {Route, IndexRoute} from 'react-router';

import MapLayout from 'layouts/map';
import Entry from 'layouts/entry';
import Report from 'containers/report';

const Cranes = () => {};
const CraneInfo = () => {};

export default (store) => {
  return (
    <Route path='/' component={MapLayout}>
      <IndexRoute component={Entry} />
      <Route path='cranes' component={Cranes}>
        <Route path=':id' component={CraneInfo} />
      </Route>
      <Route path='report' component={Report} />
    </Route>
  );
};
