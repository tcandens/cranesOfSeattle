const geojson = {
  pointFromLngLat: (lnglat, properties) => {
    const longitude = lnglat.longitude || lnglat.lng;
    const latitude = lnglat.latitude || lnglat.lat;
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      properties: {
        user_id: properties.userId,
      },
    };
  },
};

export default geojson;
