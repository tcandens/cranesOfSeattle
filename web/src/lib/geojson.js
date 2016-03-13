const geojson = {};

geojson.pointFromLngLat = (lnglat) => {
  const longitude = lnglat.longitude || lnglat.lng;
  const latitude = lnglat.latitude || lnglat.lat;
  return {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [longitude, latitude]
    },
    'properties': {
      'user_id': 11
    }
  };
};

export default geojson;
