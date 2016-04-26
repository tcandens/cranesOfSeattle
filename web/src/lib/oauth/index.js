import Promise from 'bluebird';
import queryString from 'query-string';

const POPUP_NAME = 'Sign In Popup';
const GOOGLE_OAUTH_WINDOW_FEATURES = `
  width=320,
  height=570,
  scrollbars=no,
  locationbar=no
`;

export function createGoogleTokenUrl(queries) {
  queries = queries || {};
  queries['client_id'] = GOOGLE_CLIENT_ID;
  const protocol = window.location.protocol;
  if (queries.redirect_uri) {
    queries.redirect_uri = `${protocol}//${queries.redirect_uri}`;
  }
  const qstring = queryString.stringify(queries);
  return `https://accounts.google.com/o/oauth2/v2/auth?${qstring}`;
}

export function loginPopup() {
  const authUrl = createGoogleTokenUrl({
    redirect_uri: `${window.location.host}/api/auth/google/callback`,
    response_type: 'token',
    state: 'profile',
    scope: 'profile'
  });
  const popup = window.open(authUrl, POPUP_NAME, GOOGLE_OAUTH_WINDOW_FEATURES);
  listenForToken(popup, (error, token) => {
    console.log(token)
  });
}

function listenForToken(popup, cb) {
  let parsed;
  try {
    parsed = parsePopupLocation(popup);
  } catch(e) {}
  if (parsed && parsed['access_token']) {
    cb(null, parsed['access_token']);
    window.clearTimeout(window.CRANES_TIMER);
    popup.close();
  } else {
    window.CRANES_TIMER = setTimeout(() => {
      listenForToken(popup, cb);
    }, 500);
  }
}

function parsePopupLocation(popup) {
  return queryString.parse(popup.location.hash);
}
