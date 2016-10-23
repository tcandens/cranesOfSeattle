import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
  fetchUserById,
} from 'ducks/leaderboard';

const selectUserViewing = (state) => ({
  isFetching: state.leaderboard.isFetching,
  user: state.leaderboard.viewing,
});

@connect(
  selectUserViewing
)
export default class UserProfile extends Component {
  componentDidMount = () => {
    const {
      userId,
    } = this.props.params;
    this.props.dispatch(fetchUserById(userId));
  }
  render = () => {
    const {
      name,
      points,
      image_url,
    } = this.props.user;
    return (
      <section className="c-user-profile">
        <table className="c-user-profile--table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><img className="avatar" src={image_url} /></td>
              <td>{name}</td>
              <td>{points}</td>
            </tr>
          </tbody>
        </table>
      </section>
    );
  }
}
