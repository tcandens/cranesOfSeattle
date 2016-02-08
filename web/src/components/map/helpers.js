export function createLayer(sourceName) {
  return {
    'id': sourceName,
    'type': 'symbol',
    'source': sourceName,
    'layout': {
      'icon-image': 'default_marker',
      'text-field': 'Report',
      'text-anchor': 'top',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold']
    }
  };
}
