import axios from 'axios';
import geojson from 'lib/geojson';
const assign = Object.assign;

const REQUEST_REPORTS = 'REQUEST_REPORTS';
const RECEIVE_REPORTS = 'RECEIVE_REPORTS';
const START_REPORT ='START_REPORT';
const ADD_REPORT = 'ADD_REPORT';
const FINISH_REPORT = 'FINISH_REPORT';
const REMOVE_REPORT = 'REMOVE_REPORT';

export default function reducer(state = {
  isFetching: false,
  isReporting: false,
  geojson: {
    features: []
  },
  reported: [],
  newReport: {}
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
    case START_REPORT:
      return assign({}, state, {
        isReporting: true
      });
    case ADD_REPORT:
      const {report} = action;
      return assign({}, state, {
        geojson: assign({}, state.geojson, {
          features: [...state.geojson.features, report]
        }),
        reported: [report, ...state.reported]
      });
    case FINISH_REPORT:
      return assign({}, state, {
        isReporting: false
      });
    case REMOVE_REPORT:
      return assign({}, state, {
        geojson: assign({}, state.geojson, {
          features: [...state.geojson.features]
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

export function addReport(report) {
  return {
    type: ADD_REPORT,
    report
  };
}

export function startReport(location) {
  return {
    type: START_REPORT,
    location
  };
}

export function finishReport() {
  return {
    type: FINISH_REPORT
  };
}

import store from '../store';

export function saveReport(location, props) {
  return function (dispatch) {
    const state = store.getState();
    const userId = state.user.profile.id || null;
    const token = state.user.token || null;
    if (!userId || !token) {
      dispatch({error: 'Not Authorized'});
    }
    const report = geojson.pointFromLngLat(location, {userId, ...props});
    dispatch(addReport(report));
    // check for isAuthenticated && user.profile.token
    const requestConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    return axios.post('/api/reports', report, requestConfig)
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
