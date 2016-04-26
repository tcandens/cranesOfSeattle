import axios from 'axios';

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export function requestLogin() {
  return {
    type: REQUEST_LOGIN,
    isFetching: true,
    isAuthenticated: false
  };
}

export const RECEIVE_LOGIN = 'RECIEVE_LOGIN';
export function receiveLogin(profile) {
  return {
    type: RECEIVE_LOGIN,
    isFetching: false,
    isAuthenticated: true,
    profile
  };
}

export const ERROR_LOGIN = 'ERROR_LOGIN';
export function errorLogin(error) {
  return {
    type: ERROR_LOGIN,
    isFetching: false,
    isAuthenticated: false,
    message: error.message
  };
}

import {loginPopup, parseSearchString} from 'lib/oauth';
import {browserHistory} from 'react-router';

export function userLogin(options) {
  return dispatch => {
    dispatch(requestLogin());
    loginPopup().then(profile => {
      console.log(profile)
      dispatch(receiveLogin(profile));
    });
  };
}
