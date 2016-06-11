import axios from 'axios';
import geojson from 'lib/geojson';
const assign = Object.assign;

export const REQUEST_CRANES = 'REQUEST_CRANES';
export const RECEIVE_CRANES = 'RECEIVE_CRANES';
export const ADD_CRANE = 'ADD_CRANE';

export const initialState = {
  isFetching: false,
  geojson: {
    features: [],
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_CRANES:
      return assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_CRANES:
      return assign({}, state, {
        isFetching: false,
        geojson: action.geojson,
        lastUpdated: action.receivedAt,
      });
    case ADD_CRANE:
      return assign({}, state, {
        geojson: assign({}, state.geojson, {
          features: [
            ...state.geojson.features,
            geojson.pointFromLngLat(action.location),
          ],
        }),
      });
    default:
      return state;
  }
}

export function requestCranes() {
  return {
    type: REQUEST_CRANES,
    isFetching: true,
  };
}

export function receiveCranes(geojsonObject) {
  return {
    type: RECEIVE_CRANES,
    geojson: geojsonObject,
    isFetching: false,
    receivedAt: Date.now(),
  };
}

export function fetchCranes() {
  return (dispatch) => {
    dispatch(requestCranes());
    return axios.get('/api/cranes')
      .then(response => {
        dispatch(receiveCranes(response.data));
      })
      .catch(error => {
        window.console.log(error);
      });
  };
}

export function addCrane(location) {
  return {
    type: ADD_CRANE,
    location,
  };
}
