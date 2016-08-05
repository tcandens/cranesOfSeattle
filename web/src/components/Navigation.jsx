import React from 'react';
import {Link, IndexLink} from 'react-router';

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
            to="/report"
            activeClassName="navigation--link-active"
          >
            Report
          </Link>
        </li>
        <li>
          <Link
            data-icon="user"
            to="/user"
            activeClassName="navigation--link-active"
          >
            User
          </Link>
        </li>
      </ul>
    </nav>
  );
}
