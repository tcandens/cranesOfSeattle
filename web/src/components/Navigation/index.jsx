import React from 'react';
import {Link, IndexLink} from 'react-router';

const ACTIVE = {display: 'none'};

export default function Navigation() {
  return (
    <nav className="navigation">
      <ul className="navigation--list">
        <li>
          <IndexLink
            data-icon="home"
            to="/"
            activeClassName="navigation--link-active-home"
          >
            Home
          </IndexLink>
        </li>
        <li>
          <Link
            data-icon="map"
            to="/map"
            activeClassName="navigation--link-active"
          >
            Map
          </Link>
        </li>
        <li>
          <Link
            data-icon="report"
            to="/report"
            activeClassName="navigation--link-active"
          >
            Report
          </Link>
        </li>
      </ul>
    </nav>
  );
}
