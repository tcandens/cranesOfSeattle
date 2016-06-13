import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Button from 'components/Button';

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
  renderIsAuthenticated = () => {
    return (
      <Button>
        <Link to={this.props.to}>{this.props.children}</Link>
      </Button>
    );
  }
  renderIsUnauthenticated = () => {
    return (
      <Button
        onClick={this.handleLoginSubmit}
        className="login button button-l"
      >
        {this.props.children || 'Sign in'}
      </Button>
    );
  }
  render = () => {
    if (this.props.isAuthenticated) {
      return this.renderIsAuthenticated();
    } else {
      return this.renderIsUnauthenticated();
    }
  }
}
