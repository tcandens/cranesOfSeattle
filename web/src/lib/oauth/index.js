import Promise from 'bluebird';
import {
  listenForToken,
  fetchGoogleProfile,
  createGoogleTokenUrl
} from './utils';

const POPUP_NAME = 'Sign In Popup';
const GOOGLE_OAUTH_WINDOW_FEATURES = `
  width=320,
  height=570,
  scrollbars=no,
  locationbar=no
`;

export function loginPopup() {
  const authUrl = createGoogleTokenUrl();
  const popup = window.open(authUrl, POPUP_NAME, GOOGLE_OAUTH_WINDOW_FEATURES);
  return listenForToken(popup).then(token => {
    return fetchGoogleProfile(token);
  }).then(profile => {
    return Promise.resolve(profile);
  }).catch(error => {
    return Promise.reject(error);
  });
}
