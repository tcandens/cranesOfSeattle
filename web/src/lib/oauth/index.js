import jwtDecode from 'jwt-decode';
import {
  listenForToken
} from './utils';

const POPUP_NAME = 'Sign In Popup';
const GOOGLE_OAUTH_WINDOW_FEATURES = `
  width=320,
  height=570,
  scrollbars=no,
  locationbar=no
`;

export function loginPopup() {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const endpoint = '/api/auth/google';
  const authEndpoint = `${protocol}//${host}${endpoint}`;
  const popup = window.open(authEndpoint, POPUP_NAME, GOOGLE_OAUTH_WINDOW_FEATURES);
  return listenForToken(popup).then(token => {
    const decoded = jwtDecode(token);
    const profile = {
      ...decoded,
      token
    };
    return profile;
  });
}
