import {combineReducers} from 'redux';
import reports from './reports';
import cranes from './cranes';
import map from './map';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  reports,
  cranes,
  map,
  routing: routerReducer
});

export default rootReducer;
