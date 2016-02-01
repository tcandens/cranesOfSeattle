import {combineReducers} from 'redux';
import reports from './reports';
import map from './map';

const rootReducer = combineReducers({
  reports,
  map
});

export default rootReducer;
