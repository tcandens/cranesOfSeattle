import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Button from 'components/Button';
import Leaderboard from 'components/Leaderboard';
import Prefetch from 'components/Prefetch';

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
          <thead>
            <tr>
              <td></td>
              <td>Points</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img className="avatar" src={image_url} />
              </td>
              <td>{points}</td>
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
  render = () => {
    return (
      <section className="c-user">
        {this.props.children}
        <Leaderboard leaders={this.props.leaders} />
        {this.props.isAuthenticated ? this.profile : this.login}
        <Prefetch />
      </section>
    );
  }
}
