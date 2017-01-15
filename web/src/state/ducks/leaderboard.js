import axios from 'axios';
const assign = Object.assign;

const REQUEST_LEADERBOARD = 'REQUEST_LEADERBOARD';
const RECEIVE_LEADERBOARD = 'RECEIVE_LEADERBOARD';
const ERROR_FETCHING_LEADERBOARD = 'ERROR_FETCHING_LEADERBOARD';
const REQUEST_USER = 'REQUEST_USER';
const RECEIVE_USER = 'RECEIVE_USER';
const ERROR_FETCHING_USER = 'ERROR_FETCHING_LEADERBOARD';

export const initialState = {
  isFetching: false,
  data: [],
  viewing: {},
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
    case REQUEST_USER:
      return assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_USER:
      return assign({}, state, {
        isFetching: false,
        viewing: action.payload,
      });
    case ERROR_FETCHING_USER:
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
      receivedAt: performance.now(),
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

export function requestUser(userId) {
  return {
    type: REQUEST_USER,
    userId,
  };
}

export function receiveUser(user) {
  return {
    type: RECEIVE_USER,
    payload: user,
  };
}

export function errorFetchingUser(error) {
  return {
    type: ERROR_FETCHING_USER,
    payload: error,
  };
}

export function fetchUserById(userId) {
  return (dispatch) => {
    dispatch(requestUser(userId));
    return axios.get(`/api/users/${userId}`)
      .then(response => {
        dispatch(receiveUser(response.data));
      })
      .catch(error => {
        dispatch(errorFetchingUser(error));
      });
  };
}
