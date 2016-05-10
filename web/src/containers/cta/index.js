import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LoginButton from 'containers/login';
import classNames from 'classnames';
import {Link} from 'react-router';

@connect(
  (state) => {
    return {
      isAuthenticated: state.user.isAuthenticated
    };
  }
)
export default class CtaContainer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  renderReportButton = () => {
    const {isAuthenticated} = this.props;
    let reportButton;
    if (isAuthenticated) {
      reportButton = <Link className='button button--lg' to='/report'>
        Report a crane</Link>;
    } else {
      reportButton = <LoginButton to='/report'>Sign in to report a crane
        </LoginButton>;
    }
    return reportButton;
  }
  render() {
    return (
      <ul className='list--vertical'>
        <Link to='/map' className='button button--lg'>
          View the cranes
        </Link>
        {this.renderReportButton()}
      </ul>
    );
  }
}
