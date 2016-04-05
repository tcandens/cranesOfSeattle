import React from 'react';
import {Route} from 'react-router';

import Entry from 'components/entry';
import Map from 'components/map';

export default (store) => (
  <Route path='/' component={Entry} >
  </Route>
);
