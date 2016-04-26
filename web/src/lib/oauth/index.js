import Promise from 'bluebird';
import queryString from 'query-string';
import axios from 'axios';

export function loginPopup() {
  const POPUP_NAME = 'Sign In Popup';
  const GOOGLE_OAUTH_WINDOW_FEATURES = `
    width=320,
    height=570,
    scrollbars=no,
    locationbar=no
  `;
  const authUrl = createGoogleTokenUrl({
    redirect_uri: `${window.location.host}/api/auth/google/callback`,
    response_type: 'token',
    state: 'profile',
    scope: 'profile'
  });
  const popup = window.open(authUrl, POPUP_NAME, GOOGLE_OAUTH_WINDOW_FEATURES);
  listenForToken(popup).then(token => {
    return fetchGoogleProfile(token)
  }).then(profile => {
    console.log(profile);
  });
}

function fetchGoogleProfile(token) {
  const googleApiUrl = 'https://www.googleapis.com/userinfo/v2/me';
  return axios.get(googleApiUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    return Promise.resolve(response.data);
  });
}

function createGoogleTokenUrl(queries) {
  queries = queries || {};
  queries['client_id'] = GOOGLE_CLIENT_ID;
  const protocol = window.location.protocol;
  if (queries.redirect_uri) {
    queries.redirect_uri = `${protocol}//${queries.redirect_uri}`;
  }
  const qstring = queryString.stringify(queries);
  return `https://accounts.google.com/o/oauth2/v2/auth?${qstring}`;
}

function listenForToken(popup) {
  return new Promise(resolve => {
    let parsed;
    function tryParsing(popup) {
      try {
        parsed = parsePopupLocation(popup);
      } catch(e) {}
      if (parsed && parsed['access_token']) {
        resolve(parsed.access_token);
        window.clearTimeout(window.CRANES_TIMER);
        popup.close();
      } else {
        window.CRANES_TIMER = setTimeout(() => {
          tryParsing(popup);
        }, 500);
      }
    }
    tryParsing(popup);
  });
}

function parsePopupLocation(popup) {
  return queryString.parse(popup.location.hash);
}
