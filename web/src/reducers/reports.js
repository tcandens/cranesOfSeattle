import {combineReducers} from 'redux';
import {
  REQUEST_REPORTS,
  RECEIVE_REPORTS,
  ADD_REPORT,
  MOVE_MAP
} from  '../actions/reports';

const assign = Object.assign;

function reports(state = {
  isFetching: false,
  geojson: {}
}, action) {
  switch (action.type) {
    case REQUEST_REPORTS:
      return assign({}, state, {
        isFetching: true
      });
    case RECEIVE_REPORTS:
      return assign({}, state, {
        isFetching: false,
        geojson: action.geojson,
        lastUpdated: action.receivedAt
      });
    case ADD_REPORT:
      return assign({}, state, {
        geojson: assign({}, state.geojson, {
          features: [...state.geojson.features, action.report]
        })
      });
    default:
      return state;
  }
}

function map(state = {
  mapPosition: []
}, action) {
  switch (action.type) {
    case MOVE_MAP:
      return assign({}, state, {
        mapPosition: action.position
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  reports,
  map
});

export default rootReducer;
