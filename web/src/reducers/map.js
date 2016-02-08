import {
  RECORD_MAP_LOCATION
} from 'actions/map';

const assign = Object.assign;

function map(state = {
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

export default map;
