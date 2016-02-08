import axios from 'axios';

export const REQUEST_REPORTS = 'REQUEST_REPORTS';
export function requestReports() {
  return {
    type: REQUEST_REPORTS,
    isFetching: true
  };
}

export const RECEIVE_REPORTS = 'RECEIVE_REPORTS';
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

export const ADD_REPORT = 'ADD_REPORT';
export function addReport(location) {
  return {
    type: ADD_REPORT,
    location
  };
}

export function saveReport(report) {
  return function (dispatch) {
    dispatch(addReport(report));
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
