import axios from 'axios';
import geojson from 'lib/geojson';
const assign = Object.assign;

const REQUEST_CRANES = 'REQUEST_CRANES';
const RECEIVE_CRANES = 'RECEIVE_CRANES';
const ADD_CRANE = 'ADD_CRANE';

export default function reducer(state = {
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

export function requestCranes() {
  return {
    type: REQUEST_CRANES,
    isFetching: true
  };
}

export function receiveCranes(geojson) {
  return {
    type: RECEIVE_CRANES,
    geojson: geojson,
    isFetching: false,
    receivedAt: Date.now()
  };
}

export function fetchCranes() {
  return function (dispatch) {
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
    location
  };
}

export function saveCrane(location) {
  return function (dispatch) {
    dispatch(addCrane(location));
    const crane = geojson.pointFromLngLat(location);
    return axios.post('/api/cranes', crane)
      .then(response => {
        window.console.log(response);
      })
      .catch(error => {
        window.console.log(error);
      });
  };
}
