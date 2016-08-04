import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Button from 'components/Button';

import {
  fetchLeaderboard,
} from 'ducks/leaderboard';

function selectLeaderboard(state) {
  return {
    isAuthenticated: state.user.isAuthenticated,
    profile: state.user.profile,
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
  get profile() {
    const {
      name,
      id,
      image_url,
      points,
    } = this.props.profile;
    return (
      <section className="c-user--profile">
        <h1>Your Profile</h1>
        <table className="table">
          <tbody>
            <tr>
              <td>{points}</td>
              <td>
                <img className="avatar" src={image_url} />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    );
  }
  get login() {
    return (
      <Link to="/login">
        <Button className="button--dark">Login to view profile</Button>
      </Link>
    );
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
      <section className="c-user">
        <section className="c-leaderboard">
          <h1 className="header">User leaderboard</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {this.leaders}
            </tbody>
          </table>
        </section>
        {this.props.isAuthenticated ? this.profile : this.login}
      </section>
    );
  }
}
