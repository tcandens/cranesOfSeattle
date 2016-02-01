import {
  MOVE_MAP
} from '../actions/map';

const assign = Object.assign;

function map(state = {
  mapPosition: []
}, action) {
  switch (action.type) {
    case MOVE_MAP:
      return assign({}, state, {
        mapPosition: action.position
      });
    default:
      return state;
  }
}

export default map;
