import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  userLogin
} from 'actions/user';

@connect()
export default class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  handleLoginSubmit = () => {
    const {dispatch} = this.props;
    dispatch(userLogin());
  }
  render = () => {
    return (
      <div className='c-login'>
        <div
          onClick={this.handleLoginSubmit}
          className='c-button c-button--lg c-button--auth'>Facebook</div>
      </div>
    );
  }
}
