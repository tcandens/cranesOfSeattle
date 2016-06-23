import jwtDecode from 'jwt-decode';
import {
  listenForToken,
} from './utils';

const POPUP_NAME = 'Sign In Popup';

const providers = {
  google: {
    endpoint: '/api/auth/google',
    windowFeatures: `
      width=320,
      height=570,
      scrollbars=no,
      locationbar=no
    `,
  },
  facebook: {
    endpoint: '/api/auth/facebook',
    windowFeatures: `
      width=320,
      height=570,
      scrollbars=no,
      locationbar=no
    `,
  },
};

export function loginPopup(provider) {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const endpoint = providers[provider].endpoint;
  const authEndpoint = `${protocol}//${host}${endpoint}`;
  const popup = window.open(authEndpoint, POPUP_NAME, providers[provider].windowFeatures);
  return listenForToken(popup).then(token => {
    const decoded = jwtDecode(token);
    const profile = {
      ...decoded,
      token,
    };
    return profile;
  });
}
