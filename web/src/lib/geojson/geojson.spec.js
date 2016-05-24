import test from 'ava';
import geojson from './';

test('#pointFromLngLat', t => {
  const location = {
    longitude: 42,
    latitude: 42,
  };
  const id = 1;
  const feature = geojson.pointFromLngLat(
    location,
    {userId: id},
  );

  t.is(
    feature.type,
    'Feature',
    'Should return geoJSON with type "Feature".'
  );
  t.is(
    feature.geometry.type,
    'Point',
    'Should return a geometry type of "Point".'
  );
  t.is(
    feature.geometry.coordinates[0],
    location.longitude,
    'Should return location provided'
  );
  t.is(
    feature.properties.user_id,
    id,
    'Should return populated properties.'
  );
});
