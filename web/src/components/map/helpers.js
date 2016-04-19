export function createLayer(sourceName) {
  return {
    'id': sourceName,
    'type': 'symbol',
    'source': sourceName,
    'layout': {
      'icon-image': sourceName,
      'icon-allow-overlap': 'true',
      'icon-ignore-placement': 'false',
      'icon-offset': [-5, -20],
      'icon-padding': 10
    }
  };
}
