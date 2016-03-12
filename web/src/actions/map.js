import * as geo from '../lib/geolocation';

export const MOVE_MAP = 'MOVE_MAP';
export function moveMap(view) {
  return {
    type: MOVE_MAP,
    currentPosition: view
  };
}

export const SET_VIEW = 'SET_VIEW';
export function setView(view) {
  return {
    type: SET_VIEW,
    view: view
  };
}

export const GETTING_USER_POSITION = 'GETTING_USER_POSITION';
export function gettingUserPosition() {
  return {
    type: GETTING_USER_POSITION,
    isFetching: true
  };
}
export const RECEIVE_USER_POSITION = 'RECEIVE_USER_POSITION';
export function receiveUserPosition(position) {
  return {
    type: RECEIVE_USER_POSITION,
    isFetching: false,
    userPosition: position
  };
}

export const SET_VIEW_ON_USER = 'SET_VIEW_ON_USER';
export function setViewOnUser() {
  return function(dispatch) {
    dispatch(gettingUserPosition())
    geo.getUserPosition()
      .then(position => {
        dispatch(receiveUserPosition(position.coords));
        dispatch(setView(position.coords));
      })
      .catch(error => {
        // Dispatch error
        console.log(error)
      })
  };
}
