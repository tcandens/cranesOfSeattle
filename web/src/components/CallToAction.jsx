import React from 'react';
import LoginButton from 'containers/LoginButton';
import {Link} from 'react-router';

export default function CallToAction() {
  return (
    <ul className="list--vertical">
      <Link to="/explore" className="button button--lg">
        View the cranes
      </Link>
      <LoginButton to="/report">Login to Report</LoginButton>
    </ul>
  );
}
