import expect from 'expect';
import reducer, {
  initialState,
  REQUEST_CRANES,
  RECEIVE_CRANES,
  ADD_CRANE,
} from '../../src/redux/ducks/cranes.js';

describe('Cranes Reducer', () => {
  it('should have a certain initial state.', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should return fetching/loading state.', () => {
    expect(reducer({}, {
      type: REQUEST_CRANES,
    })).toEqual({
      isFetching: true,
    });
  });

  it('should return with geoJSON object, timestamp, and fetching state', () => {
    const now = Date.now();
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {type: 'Feature'},
      ],
    };
    expect(reducer({}, {
      type: RECEIVE_CRANES,
      geojson,
      receivedAt: now,
    })).toEqual({
      isFetching: false,
      geojson,
      lastUpdated: now,
    });
  });

});
