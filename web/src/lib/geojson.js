const geojson = {};

geojson.pointFromLngLat = (lnglat) => {
  return {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [lnglat.lng, lnglat.lat]
    },
    'properties': {
      'user_id': 11
    }
  };
};

export default geojson;
