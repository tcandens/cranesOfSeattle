import Promise from 'bluebird'

export const getUserPosition = function() {
  return new Promise(function(resolve, reject) {
    if (!navigator.geolocation) reject('Geolocation no supported.');
    navigator.geolocation.getCurrentPosition(position => {
      resolve(position);
    });
  });
}
