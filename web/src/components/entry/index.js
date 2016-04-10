import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {Link} from 'react-router';

export default class Entry extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render = () => {
    const entryClass = classNames({
      'c-entry': true
    });
    return (
      <section className={entryClass}>
        <h1>Hello, from React-Router!</h1>
        <Link to='/map'>Map</Link>
      </section>
    );
  }
}
