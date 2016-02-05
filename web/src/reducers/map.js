import {
  MOVE_MAP,
  SET_VIEW,
  GETTING_USER_POSITION,
  RECEIVE_USER_POSITION,
  SET_VIEW_ON_USER
} from '../actions/map';

const assign = Object.assign;

function map(state = {
  view: {},
  isFetching: false,
  currentPosition: {}
}, action) {
  switch (action.type) {
    case MOVE_MAP:
      return assign({}, state, {
        currentPosition: action.view
      });
    case SET_VIEW:
      return assign({}, state, {
        view: action.view
      });
    case GETTING_USER_POSITION:
      return assign({}, state, {
        isFetching: action.isFetching
      });
    case RECEIVE_USER_POSITION:
      return assign({}, state, {
        isFetching: action.isFetching,
        userPosition: action.userPosition,
        updatedAt: Date.now()
      });
    default:
      return state;
  }
}

export default map;
