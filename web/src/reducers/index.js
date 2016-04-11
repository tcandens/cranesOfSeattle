import {combineReducers} from 'redux';
import reports from './reports';
import cranes from './cranes';
import map from './map';
import user from './user';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  reports,
  cranes,
  map,
  user,
  routing: routerReducer
});

export default rootReducer;
