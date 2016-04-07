import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';

import './index.styl';

export default class Entry extends Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    return (
      <section className='c-header--hero'>
        <h1>Hello, from React-Router!</h1>
        <Link to='/map'>Map</Link>
      </section>
    );
  }
}
