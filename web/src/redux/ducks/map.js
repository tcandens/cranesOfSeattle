import {getUserPosition} from 'lib/geolocation';
const assign = Object.assign;

export const RECORD_MAP_LOCATION = 'RECORD_MAP_LOCATION';
export const REQUEST_USER_LOCATION = 'REQUEST_USER_LOCATION';
export const RECEIVE_USER_LOCATION = 'RECEIVE_USER_LOCATION';
export const ERROR_USER_LOCATION = 'ERROR_USER_LOCATION';

export const initialState = {
  location: {
    lng: null,
    lat: null,
    isFetching: false,
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
          error: action.error,
        },
      });
    default:
      return state;
  }
}

export function recordMapLocation(location) {
  return {
    type: RECORD_MAP_LOCATION,
    location,
    recordedAt: Date.now(),
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
