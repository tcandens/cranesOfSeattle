import React from 'react';
import {Route} from 'react-router';

import Entry from 'components/entry';

export default (store) => (
  <Route path='/' component={Entry} />
);
