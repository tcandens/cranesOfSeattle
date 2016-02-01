import {combineReducers} from 'redux'
import {
  REQUEST_REPORTS,
  RECEIVE_REPORTS
} from  '../actions/reports'

const assign = Object.assign;

function reports(state = {
  isFetching: false,
  geojson: {}
}, action) {
  switch (action.type) {
    case REQUEST_REPORTS:
      return assign({}, state, {
        isFetching: true
      })
    case RECEIVE_REPORTS:
      return assign({}, state, {
        isFetching: false,
        geojson: action.geojson,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  reports
});

export default rootReducer;
