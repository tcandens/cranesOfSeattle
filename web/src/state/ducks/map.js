import {getUserPosition} from '../../lib/geolocation';
const assign = Object.assign;

export const RECORD_MAP_LOCATION = 'RECORD_MAP_LOCATION';
export const REQUEST_USER_LOCATION = 'REQUEST_USER_LOCATION';
export const RECEIVE_USER_LOCATION = 'RECEIVE_USER_LOCATION';
export const ERROR_USER_LOCATION = 'ERROR_USER_LOCATION';
export const BEGIN_LOADING = 'BEGIN_LOADING';
export const FINISH_LOADING = 'FINISH_LOADING';
export const ERROR_LOADING = 'ERROR_LOADING';

export const initialState = {
  isLoading: false,
  location: {
    lat: 47.60841305322171,
    lng: -122.3344039336499,
    isFetching: false,
    error: 0,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RECORD_MAP_LOCATION:
      return assign({}, state, {
        location: {
          ...action.location,
          isFetching: false,
        },
      });
    case REQUEST_USER_LOCATION:
      return assign({}, state, {
        location: {
          ...state.location,
          isFetching: true,
        },
      });
    case RECEIVE_USER_LOCATION:
      return assign({}, state, {
        location: {
          ...state.location,
          isFetching: false,
          ...action.location,
        },
      });
    case ERROR_USER_LOCATION:
      return assign({}, state, {
        location: {
          ...state.location,
          isFetching: false,
          error: action.error.code,
        },
      });
    case BEGIN_LOADING:
      return assign({}, state, {
        isLoading: true,
      });
    case FINISH_LOADING:
      return assign({}, state, {
        isLoading: false,
      });
    default:
      return state;
  }
}

export function recordMapLocation(location) {
  return {
    type: RECORD_MAP_LOCATION,
    location,
    recordedAt: performance.now(),
  };
}

export function requestUserLocation() {
  return {
    type: REQUEST_USER_LOCATION,
  };
}

export function receiveUserLocation(location) {
  return {
    type: RECEIVE_USER_LOCATION,
    location,
  };
}

export function errorUserLocation(error) {
  return {
    type: ERROR_USER_LOCATION,
    error,
  };
}

export function fetchUserLocation() {
  return (dispatch) => {
    dispatch(requestUserLocation());
    getUserPosition().then(location => {
      dispatch(receiveUserLocation({
        lng: location.coords.longitude,
        lat: location.coords.latitude,
      }));
    })
    .catch(error => {
      dispatch(errorUserLocation(error));
    });
  };
}

export function beginLoading() {
  return {
    type: BEGIN_LOADING,
  };
}

export function finishLoading() {
  return {
    type: FINISH_LOADING,
  };
}
