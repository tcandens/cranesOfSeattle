import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  userLogin,
} from 'ducks/user';

@connect(
  (state) => {
    return {
      isAuthenticated: state.user.isAuthenticated,
      isFetching: state.user.isFetching,
    };
  }
)
export default class LoginButton extends Component {
  state = {};
  handleLoginSubmit = (e) => {
    const {dispatch, to} = this.props;
    e.preventDefault();
    dispatch(userLogin({redirect: to}));
  }
  render = () => {
    const {children} = this.props;
    return (
      <button
        onClick={this.handleLoginSubmit}
        className='login button button--lg'>
          {children || 'Sign in'}
      </button>
    );
  }
}

LoginButton.propTypes = {
  isAuthenticated: PropTypes.boolean,
  isFetching: PropTypes.boolean,
};
