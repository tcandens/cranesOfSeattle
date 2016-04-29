import Promise from 'bluebird';
import axios from 'axios';
import defaults from 'lodash/defaults';
import queryString from 'query-string';

export function parsePopupLocation(popup) {
  return queryString.parse(popup.location.hash);
}

export function fetchGoogleProfile(token) {
  const googleApiUrl = 'https://www.googleapis.com/userinfo/v2/me';
  return axios.get(googleApiUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    return Promise.resolve(response.data);
  });
}

export function createGoogleTokenUrl(queries) {
  if (!GOOGLE_CLIENT_ID) {
    return console.warn('Google Client ID required.');
  }
  queries = defaults(queries, {
    redirect_uri: `${window.location.host}/api/auth/google/callback`,
    response_type: 'token',
    state: 'profile',
    scope: 'email'
  });
  queries['client_id'] = GOOGLE_CLIENT_ID;
  const protocol = window.location.protocol;
  if (queries.redirect_uri) {
    queries.redirect_uri = `${protocol}//${queries.redirect_uri}`;
  }
  const qstring = queryString.stringify(queries);
  return `https://accounts.google.com/o/oauth2/v2/auth?${qstring}`;
}

export function listenForToken(popup) {
  const URI_STRING = 'token';
  return new Promise(resolve => {
    let parsed;
    function tryParsing(popup) {
      try {
        parsed = parsePopupLocation(popup);
      } catch(e) {}
      if (parsed && parsed[URI_STRING]) {
        resolve(parsed[URI_STRING]);
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
