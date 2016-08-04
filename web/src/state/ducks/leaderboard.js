import axios from 'axios';
const assign = Object.assign;

const REQUEST_LEADERBOARD = 'REQUEST_LEADERBOARD';
const RECEIVE_LEADERBOARD = 'RECEIVE_LEADERBOARD';
const ERROR_FETCHING_LEADERBOARD = 'ERROR_FETCHING_LEADERBOARD';

export const initialState = {
  isFetching: false,
  data: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_LEADERBOARD:
      return assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_LEADERBOARD:
      return assign({}, state, {
        isFetching: false,
        lastUpdate: action.payload.receivedAt,
        data: action.payload.data,
      });
    case ERROR_FETCHING_LEADERBOARD:
      return assign({}, state, {
        isFetching: false,
      });
    default:
      return state;
  }
}

export function requestLeaderboard() {
  return {
    type: REQUEST_LEADERBOARD,
    isFetching: true,
  };
}

export function receiveLeaderboard(leaderboard) {
  return {
    type: RECEIVE_LEADERBOARD,
    payload: {
      receivedAt: Date.now(),
      data: leaderboard,
    },
  };
}

export function errorFetchingLeaderboard(error) {
  return {
    type: ERROR_FETCHING_LEADERBOARD,
    error,
  };
}

export function fetchLeaderboard(offset = 0, limit = 25) {
  return (dispatch) => {
    dispatch(requestLeaderboard());
    return axios.get('/api/users', {
      params: {
        by: 'points',
        offset,
        limit,
      },
    })
      .then(response => {
        dispatch(receiveLeaderboard(response.data));
      })
      .catch(error => {
        dispatch(errorFetchingLeaderboard(error));
      });
  };
}
