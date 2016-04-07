const path = require('path');
const ROOT = process.cwd();

const aliases = module.exports = {
  'mapbox-gl/css': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.css'),
  'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl-dev.js'),
  'actions': path.resolve(ROOT, 'src/actions'),
  'components': path.resolve(ROOT, 'src/components'),
  'containers': path.resolve(ROOT, 'src/containers'),
  'decorators': path.resolve(ROOT, 'src/decorators'),
  'layouts': path.resolve(ROOT, 'src/layouts'),
  'lib': path.resolve(ROOT, 'src/lib'),
  'styles': path.resolve(ROOT, 'src/styles'),
  'assets': path.resolve(ROOT, './assets')
};
