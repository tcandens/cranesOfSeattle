import Promise from 'native-promise-only'

export const getUserLocation = function() {
  return new Promise(function(resolve, reject) {
    if (!navigator.geolocation) reject('Geolocation no supported.');
    navigator.geolocation.getCurrentPosition(position => {
      resolve(position);
    });
  });
}
