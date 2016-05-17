import Promise from 'bluebird';

export function getUserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject('Geolocation no supported.');
    navigator.geolocation.getCurrentPosition(position => {
      resolve(position);
    });
  });
}
