import axios from 'axios';

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export function requestLogin(credentials) {
  return {
    type: REQUEST_LOGIN,
    isFetching: true,
    isAuthenticated: false,
    credentials
  };
}

export const RECEIVE_LOGIN = 'RECIEVE_LOGIN';
export function receiveLogin(user) {
  return {
    type: RECEIVE_LOGIN,
    isFetching: false,
    isAuthenticated: true,
    token: user.token
  };
}

export const ERROR_LOGIN = 'ERROR_LOGIN';
export function errorLogin(message) {
  return {
    type: ERROR_LOGIN,
    isFetching: false,
    isAuthenticated: false,
    message
  };
}

export function userLogin(credentials) {
  return dispatch => {
    dispatch(requestLogin(credentials));
    return axios.post('/api/auth/google')
      .then(response => {
        console.log(response);
        dispatch(receiveLogin(response.user));
      })
      .catch(response => {
        dispatch(errorLogin(response));
      });
  };
}
