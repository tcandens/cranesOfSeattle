import {combineReducers} from 'redux';
import reports from './reports';
import cranes from './cranes';
import map from './map';
import user from './user';
import toolTips from './tooltips';
import leaderboard from './leaderboard';
import {routerReducer} from 'react-router-redux';

export default combineReducers({
  reports,
  cranes,
  map,
  user,
  toolTips,
  leaderboard,
  routing: routerReducer,
});
