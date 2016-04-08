// Map component includes Mapbox-GL, which is a very large library
// that should be loaded asyncronously if possible. Webpack's
// require.ensure and promises make this convenient.
import Promise from 'bluebird';

export default () => {
  return new Promise(resolve => {
    require.ensure([], require => {
      resolve({
        Map: require('./index').default
      });
    });
  });
};
