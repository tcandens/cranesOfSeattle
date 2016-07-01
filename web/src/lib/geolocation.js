import Promise from 'bluebird';

class GeolocationError extends Error {
  constructor(geoError) {
    super(geoError.message);
    this.code = geoError.code;
  }
}

export function getUserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject('Geolocation no supported.');
    navigator.geolocation.getCurrentPosition(function geoSuccess(position) {
      resolve(position);
    }, function geoFailure(error) {
      reject(new GeolocationError(error));
    }, {
      enableHighAccuracy: true,
    });
  });
}
