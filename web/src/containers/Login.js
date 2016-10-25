import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Button from '../components/Button';
import Prefetch from '../components/Prefetch';

import {
  userLogin,
} from '../state/ducks/user';

@connect(
  (state) => {
    return {
      isAuthecated: state.user.isAuthenticated,
      isFetching: state.user.isFetching,
    };
  }
)
export default class LoginContainer extends Component {
  render = () => {
    return (
      <section className="l-login">
        <h1>Login</h1>
        <p>Use your prefered sign-in method.</p>
        <div className="form-group--column">
          <Button className="button--google"
            onClick={() => {
              this.props.dispatch(userLogin({
                provider: 'google',
                redirect: '/report',
              }));
            }}
          >
            Login with Google
          </Button>
          <Button className="button--facebook"
            onClick={() => {
              this.props.dispatch(userLogin({
                provider: 'facebook',
                redirect: '/report',
              }));
            }}
          >
            Login with Facebook
          </Button>
        </div>
        <aside className="disclaimer">
          <h4>We promise we will not use your personal info for anything else.</h4>
        </aside>
        <Prefetch />
      </section>
    );
  }
}
