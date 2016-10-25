import React from 'react';
import Button from './Button.jsx';
import {Link} from 'react-router';

export default function CallToAction() {
  return (
    <ul className="list--vertical">
      <Link to="/report" className="button button--lg">
        View the cranes
      </Link>
      <Link to="/login">
        <Button>Login to Report</Button>
      </Link>
    </ul>
  );
}
