import React from 'react';
import {Link} from 'react-router';

const ACTIVE = {display: 'none'};

export default function Navigation() {
  return (
    <nav className="navigation">
      <ul className="navigation--list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/map" activeClass="">Map</Link></li>
        <li><Link to="/report" activeStyle={ACTIVE}>Report</Link></li>
      </ul>
    </nav>
  );
}
