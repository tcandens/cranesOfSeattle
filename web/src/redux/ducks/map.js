const assign = Object.assign;

const RECORD_MAP_LOCATION = 'RECORD_MAP_LOCATION';

export default function reducer(state = {
  location: []
}, action) {
  switch (action.type) {
    case RECORD_MAP_LOCATION:
      return assign({}, state, {
        location: action.location
      });
    default:
      return state;
  }
}

export function recordMapLocation(location) {
  return {
    type: RECORD_MAP_LOCATION,
    location,
    recordedAt: Date.now()
  };
}
