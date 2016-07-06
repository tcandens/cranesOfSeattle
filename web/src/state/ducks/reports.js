import Promise from 'bluebird';
import axios from 'axios';
import geojson from 'lib/geojson';
const assign = Object.assign;

const REQUEST_REPORTS = 'REQUEST_REPORTS';
const RECEIVE_REPORTS = 'RECEIVE_REPORTS';
const ERROR_FETCHING_REPORTS = 'ERROR_FETCHING_REPORTS';
const START_REPORT = 'START_REPORT';
const ADD_REPORT = 'ADD_REPORT';
const FINISH_REPORT = 'FINISH_REPORT';
const REMOVE_REPORT = 'REMOVE_REPORT';
const RESET_REPORT_STATE = 'RESET_REPORT_STATE';
const BEGIN_SAVE_REPORT = 'BEGIN_SAVE_REPORT';
const SUCCESS_SAVE_REPORT = 'SUCCESS_SAVE_REPORT';
const CONFIRM_SAVE_SUCCESS = 'CONFIRM_SAVE_SUCCESS';
const ERROR_SAVE_REPORT = 'ERROR_SAVE_REPORT';

export const initialState = {
  isFetching: false,
  isReporting: false,
  isSaving: false,
  isSaveSuccess: false,
  geojson: {
    features: [],
  },
  reported: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_REPORTS:
      return assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_REPORTS:
      return assign({}, state, {
        isFetching: false,
        geojson: action.geojson,
        lastUpdated: action.receivedAt,
      });
    case START_REPORT:
      return assign({}, state, {
        isReporting: true,
      });
    case ADD_REPORT:
      return assign({}, state, {
        geojson: assign({}, state.geojson, {
          features: [...state.geojson.features, action.report],
        }),
      });
    case FINISH_REPORT:
      return assign({}, state, {
        isReporting: false,
        report: {},
      });
    case REMOVE_REPORT:
      return assign({}, state, {
        geojson: assign({}, state.geojson, {
          features: [...state.geojson.features],
        }),
      });
    case BEGIN_SAVE_REPORT:
      return assign({}, state, {
        isSaving: true,
      });
    case SUCCESS_SAVE_REPORT:
      return assign({}, state, {
        isSaveSuccess: true,
        isSaving: false,
        reported: [...state.reported, action.payload],
      });
    case ERROR_SAVE_REPORT:
      return assign({}, state, {
        isSaveSuccess: false,
        isSaving: false,
      });
    case CONFIRM_SAVE_SUCCESS:
      return assign({}, state, {
        isSaveSuccess: false,
      });
    case RESET_REPORT_STATE:
      return assign({}, state, {
        isSaving: false,
        isReporting: false,
        report: {},
      });
    default:
      return state;
  }
}

export function requestReports() {
  return {
    type: REQUEST_REPORTS,
    isFetching: true,
  };
}

export function receiveReports(geojsonObject) {
  return {
    type: RECEIVE_REPORTS,
    geojson: geojsonObject,
    isFetching: false,
    receivedAt: Date.now(),
  };
}

export function errorFetchingReport(error) {
  return {
    type: ERROR_FETCHING_REPORTS,
    error,
  };
}

export function fetchReports() {
  return (dispatch) => {
    dispatch(requestReports());
    return axios.get('/api/reports')
      .then(response => {
        dispatch(receiveReports(response.data));
      })
      .catch(error => {
        dispatch(errorFetchingReport(error));
      });
  };
}

export function addReport(report) {
  return {
    type: ADD_REPORT,
    report,
  };
}

export function startReport(location) {
  return {
    type: START_REPORT,
    location,
  };
}

export function beginSavingReport() {
  return {
    type: BEGIN_SAVE_REPORT,
    payload: {
      time: Date.now(),
    },
  };
}

export function successSavingReport(message, result) {
  return {
    type: SUCCESS_SAVE_REPORT,
    payload: {
      message,
      result,
      time: Date.now(),
    },
  };
}

export function confirmSaveSuccess() {
  return {
    type: CONFIRM_SAVE_SUCCESS,
  };
}

export function errorSavingReport(error, report) {
  return {
    type: ERROR_SAVE_REPORT,
    payload: {
      time: Date.now(),
      error,
      report,
    },
  };
}

export function finishReport() {
  return {
    type: FINISH_REPORT,
  };
}

export function resetReportState() {
  return {
    type: RESET_REPORT_STATE,
  };
}

import {errorLogin} from 'ducks/user';

export function saveReport(location, props) {
  return (dispatch, getState) => {
    dispatch(beginSavingReport());
    const state = getState();
    const userId = state.user.profile.id || null;
    const token = state.user.token || null;
    if (!userId || !token) {
      dispatch(errorLogin('User is not logged in.'));
    }
    const report = geojson.pointFromLngLat(location, {userId, ...props});
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.post('/api/reports', report, requestConfig)
      .then(response => {
        const {message, result} = response.data;
        dispatch(successSavingReport(message, result));
        dispatch(finishReport());
      })
      .catch(error => {
        dispatch(errorSavingReport(error, report));
      });
  };
}
