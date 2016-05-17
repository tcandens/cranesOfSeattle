const assign = Object.assign;

const REQUEST_LOGIN = 'REQUEST_LOGIN';
const RECEIVE_LOGIN = 'RECIEVE_LOGIN';
const ERROR_LOGIN = 'ERROR_LOGIN';
import {REHYDRATE} from 'redux-persist/constants';

export default function reducer(state = {
  isFetching: false,
  isAuthenticated: false,
  profile: {},
  token: null,
}, action) {
  switch (action.type) {
    case REQUEST_LOGIN:
      return assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_LOGIN:
      const {token, ...profile} = action.profile;
      return assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        profile,
        token,
      });
    case ERROR_LOGIN:
      return assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        error: action.message,
      });
    case REHYDRATE:
      const incoming = action.payload.user;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    default:
      return state;
  }
}

export function requestLogin() {
  return {
    type: REQUEST_LOGIN,
    isFetching: true,
    isAuthenticated: false,
  };
}

export function receiveLogin(profile) {
  return {
    type: RECEIVE_LOGIN,
    isFetching: false,
    isAuthenticated: true,
    profile,
  };
}

export function errorLogin(error) {
  return {
    type: ERROR_LOGIN,
    isFetching: false,
    isAuthenticated: false,
    message: error.message,
  };
}

import {loginPopup} from 'lib/oauth';
import {browserHistory} from 'react-router';

export function userLogin(options) {
  return dispatch => {
    dispatch(requestLogin());
    loginPopup().then(profile => {
      dispatch(receiveLogin(profile));
      if (options.redirect) {
        browserHistory.push(options.redirect);
      }
    });
  };
}
