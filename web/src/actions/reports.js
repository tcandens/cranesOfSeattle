import axios from 'axios';

export const REQUEST_REPORTS = 'REQUEST_REPORTS';
export const RECEIVE_REPORTS = 'RECEIVE_REPORTS';

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
        const geojson = response.data.data;
        dispatch(receiveReports(geojson));
      })
      .catch(error => {
        // Dispatch an error action here
        window.console.log(error);
      });
  };
}
