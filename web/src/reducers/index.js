import {combineReducers} from 'redux';
import reports from './reports';
import cranes from './cranes';
import map from './map';

const rootReducer = combineReducers({
  reports,
  cranes,
  map
});

export default rootReducer;
