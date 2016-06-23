import jwtDecode from 'jwt-decode';
import {
  listenForToken,
  getPopupDimensions,
} from './utils';

const POPUP_NAME = 'Sign In Popup';

const endpoints = {
  google: '/api/auth/google',
  facebook: '/api/auth/facebook',
};

export function loginPopup(provider) {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const endpoint = endpoints[provider];
  const authEndpoint = `${protocol}//${host}${endpoint}`;
  const windowSettings = getPopupDimensions(provider);
  const popup = window.open(authEndpoint, POPUP_NAME, windowSettings);
  return listenForToken(popup).then(token => {
    const decoded = jwtDecode(token);
    const profile = {
      ...decoded,
      token,
    };
    return profile;
  });
}
