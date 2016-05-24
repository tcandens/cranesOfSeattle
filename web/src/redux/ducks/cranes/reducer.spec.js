import test from 'ava';
import reducer, {
  initialState,
  requestCranes,
  receiveCranes,
  addCrane,
} from './';

test('Initial State', t => {
  t.is(
    reducer(undefined, {}),
    initialState,
    'Default state is returned.'
  );
});

test('Request cranes', t => {
  t.deepEqual(
    reducer({}, requestCranes()),
    {
      isFetching: true,
    }
  );
});

test('Receive cranes', t => {
  const geoJson = {
    type: 'FeatureCollection',
    features: [
      {type: 'Feature'},
    ],
  };
  // Monkey-patching for testing
  Date.now = () => 1111;
  t.deepEqual(
    reducer({}, receiveCranes(geoJson)),
    {
      isFetching: false,
      geojson: geoJson,
      lastUpdated: Date.now(),
    }
  );
});

test.skip('Add crane', t => {
  t.is(
    reducer(undefined, addCrane())
  );
});
