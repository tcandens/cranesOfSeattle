export function createLayer(sourceName) {
  return {
    'id': sourceName,
    'type': 'symbol',
    'source': sourceName,
    'layout': {
      'icon-image': 'crane',
      'icon-allow-overlap': 'true',
      'icon-ignore-placement': 'true'
    }
  };
}
