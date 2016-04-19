import geojson from 'lib/geojson';
import assign from 'lodash/assign';

import {
  REQUEST_REPORTS,
  RECEIVE_REPORTS,
  ADD_REPORT
} from  'actions/reports';

function reports(state = {
  isFetching: false,
  geojson: {
    features: []
  }
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
      const {location, properties} = action.data;
      const report = geojson.pointFromLngLat(location, properties);
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
