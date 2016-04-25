import Promise from 'bluebird';
import queryString from 'query-string';

const AUTH_ENDPOINT = '/api/auth/google';
const RECEIVE_ENDPOINT = '/api/auth/receive';
const POPUP_NAME = 'Auth Popup';
const POPUP_FEATURES = `
  width=320,
  height=570,
  scrollbars=no,
  locationbar=no
`;

export function loginPopup() {
  return new Promise((resolve) => {
    const {protocol, host} = window.location;
    const authUrl = `${protocol}//${host}${AUTH_ENDPOINT}`;
    const _popup = window.open(authUrl, POPUP_NAME, POPUP_FEATURES);
    listenForId(_popup, (id) => {
      _popup.close();
      resolve(id);
    });
  });
}

function listenForId(popup, resolve) {
  let parsed;
  try {
    parsed = queryString.parse(popup.location);
  } catch (e) {}
  if (parsed && parsed.id) {
    resolve(parsed.id);
  } else {
    setTimeout(() => {
      listenForId(popup, resolve);
    }, 500);
  }
}
