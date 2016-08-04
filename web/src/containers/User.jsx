import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {
  fetchLeaderboard,
} from 'ducks/leaderboard';

function selectLeaderboard(state) {
  return {
    isAuthenticated: state.user.isAuthenticated,
    leaders: state.leaderboard.data,
    isFetching: state.leaderboard.isFetching,
  };
}

@connect(
  selectLeaderboard
)
export default class UserContainer extends Component {
  componentDidMount = () => {
    const {
      dispatch,
    } = this.props;
    dispatch(fetchLeaderboard());
  }
  get leaders() {
    const {
      leaders,
    } = this.props;
    const features = leaders.map((user, index) => (
      <tr key={index}>
        <td>{user.name}</td>
        <td>{user.points}</td>
        <td>
          <Link to={`/user/${user.id}`}>
            <img className="avatar" src={user.image_url} />
          </Link>
        </td>
      </tr>
    ));
    return features;
  }
  render = () => {
    return (
      <section className="c-leaderboard">
        <h1>User leaderboard</h1>
        <table className="table">
          <thead>
            <tr>
              <td>Name</td>
              <td>Points</td>
              <td>Profile</td>
            </tr>
          </thead>
          <tbody>
            {this.leaders}
          </tbody>
        </table>
      </section>
    );
  }
}
