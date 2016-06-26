import Promise from 'bluebird';
import queryString from 'query-string';

export function parsePopupLocation(popup) {
  return queryString.parse(popup.location.hash);
}

export function listenForToken(popup) {
  const URI_STRING = 'token';
  return new Promise(resolve => {
    let parsed;
    function tryParsing(popupToParse) {
      try {
        parsed = parsePopupLocation(popupToParse);
      } catch (e) {}
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

export function getPopupSize(provider) {
  switch (provider) {
    case 'google':
      return {width: 452, height: 633};
    case 'facebook':
      return {width: 580, height: 400};
    default:
      return {width: 1020, height: 618};
  }
}

export function getPopupOffset({width, height}) {
  const windowX = window.screenLeft ? window.screenLeft : window.screenX;
  const windowY = window.screenTop ? window.screenTop : window.screenY;
  const x = windowX + (window.innerWidth / 2) - (width / 2);
  const y = windowY + (window.innerHeight / 2) - (height / 2);
  return {x, y};
}

export function getPopupDimensions(provider) {
  const popupSettings = `
    scrollbars=no,
    toolbar=no,
    location=no,
    titlebar=no,
    menubar=no,
    status=no
  `;
  const {width, height} = getPopupSize(provider);
  const {x, y} = getPopupOffset({width, height});
  return `
    width=${width},
    height=${height},
    top=${y},
    left=${x},
    ${popupSettings}
  `;
}
