import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import {
  userLogin
} from 'actions/user';

@connect(
  (state) => {
    return {
      isAuthenticated: state.user.isAuthenticated,
      isFetching: state.user.isFetching
    }
  }
)
export default class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
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
        className='c-login c-button c-button--lg'>
          {children || 'Sign in'}
      </button>
    );
  }
}
