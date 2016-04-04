import axios from 'axios';
import geojson from 'lib/geojson';

export const REQUEST_CRANES = 'REQUEST_CRANES';
export function requestCranes() {
  return {
    type: REQUEST_CRANES,
    isFetching: true
  };
}

export const RECEIVE_CRANES = 'RECEIVE_CRANES';
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

export const ADD_CRANE = 'ADD_CRANE';
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
