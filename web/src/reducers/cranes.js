import geojson from 'lib/geojson';
import assign from 'lodash/assign';

import {
  REQUEST_CRANES,
  RECEIVE_CRANES,
  ADD_CRANE
} from 'actions/cranes';

function cranes(state = {
  isFetching: false,
  geojson: {}
}, action) {
  switch (action.type) {
    case REQUEST_CRANES:
      return assign({}, state, {
        isFetching: true
      });
    case RECEIVE_CRANES:
      return assign({}, state, {
        isFetching: false,
        geojson: action.geojson,
        lastUpdated: action.receivedAt
      });
    case ADD_CRANE:
      const crane = geojson.pointFromLngLat(action.location);
      return assign({}, state, {
        geojson: assign({}, state.geojson, {
          features: [...state.geojson.features, crane]
        })
      });
    default:
      return state;
  }
}

export default cranes;
