import test from 'ava';
import reducer, {
  initialState,
  RECORD_MAP_LOCATION,
  REQUEST_USER_LOCATION,
  RECEIVE_USER_LOCATION,
  ERROR_USER_LOCATION,
} from './';

test('Initial State', t => {
  t.is(
    reducer(undefined, {}),
    initialState,
    'Default state is returned.'
  );
});

test('Record map location', t => {
  const location = {
    lng: 42,
    lat: 42,
  };
  t.deepEqual(
    reducer({}, {
      type: RECORD_MAP_LOCATION,
      location,
    }),
    {
      location: {
        isFetching: false,
        lat: location.lat,
        lng: location.lng,
      },
    },
    'Should return user latlng with timestamp and state change.'
  );
});

test('Requesting user location', t => {
  t.deepEqual(
    reducer({}, {
      type: REQUEST_USER_LOCATION,
    }),
    {
      location: {
        isFetching: true,
      },
    },
    'Should return loading/fetching state.'
  );
});

test('Receiving user location', t => {
  t.deepEqual(
    reducer({
      location: {
        lat: 24,
        lng: 24.4,
      },
    }, {
      type: RECEIVE_USER_LOCATION,
      location: {
        isFetching: false,
        lng: 42.4,
      },
    }),
    {
      location: {
        isFetching: false,
        lat: 24,
        lng: 42.4,
      },
    },
    'Should return user location with state using prior location as default'
  );
});

test('Error fetching user location', t => {
  t.deepEqual(
    reducer({}, {
      type: ERROR_USER_LOCATION,
      error: 'Mother Father!',
    }),
    {
      location: {
        isFetching: false,
        error: 'Mother Father!',
      },
    }
  );
});
