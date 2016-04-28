import axios from 'axios';
import geojson from 'lib/geojson';
const assign = Object.assign;

const REQUEST_REPORTS = 'REQUEST_REPORTS';
const RECEIVE_REPORTS = 'RECEIVE_REPORTS';
const ADD_REPORT = 'ADD_REPORT';

export default function reducer(state = {
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

export function requestReports() {
  return {
    type: REQUEST_REPORTS,
    isFetching: true
  };
}

export function receiveReports(geojson) {
  return {
    type: RECEIVE_REPORTS,
    geojson: geojson,
    isFetching: false,
    receivedAt: Date.now()
  };
}

export function fetchReports() {
  return function (dispatch) {
    dispatch(requestReports());
    return axios.get('/api/reports')
      .then(response => {
        dispatch(receiveReports(response.data));
      })
      .catch(error => {
        // Dispatch an error action here
        window.console.log(error);
      });
  };
}

export function addReport(data) {
  return {
    type: ADD_REPORT,
    data
  };
}

export function saveReport(data) {
  return function (dispatch) {
    dispatch(addReport(data));
    const report = geojson.pointFromLngLat(data.location, data.properties);
    return axios.post('/api/reports', report)
      .then(response => {
        // dispatch(completeAsync(response));
        window.console.log(response);
      })
      .catch(error => {
        // dispatch(registerError(error));
        window.console.log(error);
      });
  };
}
