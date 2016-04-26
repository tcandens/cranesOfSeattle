import assign from 'lodash/assign';

import {
  REQUEST_LOGIN,
  RECEIVE_LOGIN,
  ERROR_LOGIN
} from 'actions/user';
import {REHYDRATE} from 'redux-persist/constants';

function user(state = {
  isFetching: false,
  isAuthenticated: false,
  profile: {}
}, action) {
  switch (action.type) {
    case REQUEST_LOGIN:
      return assign({}, state, {
        isFetching: true
      });
    case RECEIVE_LOGIN:
      return assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        profile: action.profile
      });
    case ERROR_LOGIN:
      return assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        error: action.message
      });
    case REHYDRATE:
      const incoming = action.payload.user;
      if (incoming) return {...state, ...incoming};
      return state;
    default:
      return state;
  }
}

export default user;
