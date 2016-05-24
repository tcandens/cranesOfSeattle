import test from 'ava';
import reducer, {
  initialState,
  REQUEST_CRANES,
  RECEIVE_CRANES,
  ADD_CRANE,
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
    reducer({}, {
      type: REQUEST_CRANES,
    }),
    {
      isFetching: true,
    },
    'Should return fetching/loading state.'
  );
});

test('Receive cranes', t => {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {type: 'Feature'},
    ],
  };
  const now = Date.now();
  t.deepEqual(
    reducer({}, {
      type: RECEIVE_CRANES,
      geojson,
      receivedAt: now,
    }),
    {
      isFetching: false,
      geojson,
      lastUpdated: now,
    },
    'Should change fetching state with timestamp and insert geoJSON.'
  );
});

test.skip('Add crane', t => {
  const location = '';
  t.is(
    reducer({}, {
      type: ADD_CRANE,
      location,
    }),
    {
      geojson: {
        features: [
          {
            type: 'feature',
            geometry: '',
          },
        ],
      },
    }
  );
});
