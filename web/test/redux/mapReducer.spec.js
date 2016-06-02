import expect from 'expect';
import reducer, {
  initialState,
  RECORD_MAP_LOCATION,
  REQUEST_USER_LOCATION,
  RECEIVE_USER_LOCATION,
  ERROR_USER_LOCATION,
} from '../../src/redux/ducks/map.js';

describe('Map reducer', () => {
  it('Should return proper initial state.', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('Should return user latlng with state change.', () => {
    const location = {
      lng: 42,
      lat: 42,
    };
    expect(reducer({}, {
      type: RECORD_MAP_LOCATION,
      location,
    })).toEqual({
      location: {
        isFetching: false,
        lat: location.lat,
        lng: location.lng,
      },
    });
  });

  it('Should return loading/fetching state', () => {
    expect(reducer({}, {
      type: REQUEST_USER_LOCATION,
    })).toEqual({
      location: {
        isFetching: true,
      },
    });
  });

  it('Should return user location with state using prior location as default', () => {
    expect(reducer({
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
    })).toEqual({
      location: {
        isFetching: false,
        lat: 24,
        lng: 42.4,
      },
    });
  });

  it('Should handle error when fetching user location', () => {
    expect(reducer({}, {
      type: ERROR_USER_LOCATION,
      error: 'Mother Father!',
    })).toEqual({
      location: {
        isFetching: false,
        error: 'Mother Father!',
      },
    });
  });
});
