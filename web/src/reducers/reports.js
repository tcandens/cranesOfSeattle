import geojson from 'lib/geojson';

import {
  REQUEST_REPORTS,
  RECEIVE_REPORTS,
  ADD_REPORT
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
      const report = geojson.pointFromLngLat(action.location);
      return assign({}, state, {
        geojson: assign({}, state.geojson, {
          features: [...state.geojson.features, report]
        })
      });
    default:
      return state;
  }
}

export default reports;
