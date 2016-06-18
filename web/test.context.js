// Shim object.assign from PhantomJS
require('object-assign-shim');

[
  require.context('./test', true, /.spec\.jsx?$/),
  require.context('./src/components/', true, /\.jsx?$/),
  require.context('./src/containers/', true, /\.jsx?$/),
  require.context('./src/lib/', true, /\.jsx?$/),
  require.context('./src/state/', true, /\.jsx?$/),
  require.context('./src/layouts/', true, /\.jsx?$/),
].forEach(context => context.keys().forEach(context));

/* eslint-disable */
//# sourceMappingURL=test.context.js.map
/* eslint-enable */
