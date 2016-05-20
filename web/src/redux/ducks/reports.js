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
const SUCCESS_SAVE_REPORT = 'SUCCESS_SAVE_REPORT';
const CONFIRM_SAVE_SUCCESS = 'CONFIRM_SAVE_SUCCESS';
const ERROR_SAVE_REPORT = 'ERROR_SAVE_REPORT';

export default function reducer(state = {
  isFetching: false,
  isReporting: false,
  isSaved: false,
  geojson: {
    features: [],
  },
  reported: [],
  newReport: {},
}, action) {
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
      });
    case REMOVE_REPORT:
      return assign({}, state, {
        geojson: assign({}, state.geojson, {
          features: [...state.geojson.features],
        }),
      });
    case SUCCESS_SAVE_REPORT:
      return assign({}, state, {
        isSaved: true,
        reported: [action.report, ...state.reported],
      });
    case CONFIRM_SAVE_SUCCESS:
      return assign({}, state, {
        isSaved: false,
      });
    case RESET_REPORT_STATE:
      return assign({}, state, {
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

export function successSavingReport(report) {
  return {
    type: SUCCESS_SAVE_REPORT,
    report,
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

export function saveReport(location, props) {
  return (dispatch, getState) => {
    const state = getState();
    const userId = state.user.profile.id || null;
    const token = state.user.token || null;
    if (!userId || !token) {
      dispatch({error: 'Not Authorized'});
    }
    const report = geojson.pointFromLngLat(location, {userId, ...props});
    dispatch(addReport(report));
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return axios.post('/api/reports', report, requestConfig)
      .then(response => {
        dispatch(successSavingReport({...response.data, ...report}));
        dispatch(resetReportState());
      })
      .catch(error => {
        dispatch(errorSavingReport(error, report));
      });
  };
}
