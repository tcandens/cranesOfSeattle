import axios from 'axios';
const assign = Object.assign;

export default function callAPIMiddleware({dispatch, getState}) {
  return next => action => {
    const shouldAuthorized = action.authorize || action.auth;
    if (typeof shouldAuthorized !== 'boolean') {
      throw new Error('Authorization switch expects boolean value');
    }
    const token = getState().user.token || null;
    if (!token) {
      throw new Error('Not Authorized');
    }
    const requestConfig = {
      headers: {
        'Authorization': `Bearer ${token}`;
      }
    }
  }
}
