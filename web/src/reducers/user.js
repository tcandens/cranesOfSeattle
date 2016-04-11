import assign from 'lodash/assign';

import {
  REQUEST_LOGIN,
  RECEIVE_LOGIN,
  ERROR_LOGIN
} from 'actions/user';

function user(state = {
  isFetching: false,
  isAuthenticated: false
}, action) {
  switch (action.type) {
    case REQUEST_LOGIN:
      return assign({}, state, {
        isFetching: true,
        user: action.credentials
      });
    case RECEIVE_LOGIN:
      return assign({}, state, {
        isFetching: false,
        isAuthenticated: true
      });
    case ERROR_LOGIN:
      return assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        error: action.message
      });
    default:
      return state;
  }
}

export default user;
