import React from 'react';
import {Route} from 'react-router';

import App from 'containers/app';

export default (store) => (
  <Route path='/' component={App} />
);
