import React, {Component, PropTypes} from 'react';

import './index.styl';

export default class Entry extends Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    return (
      <section className='c-header--hero'>
        <h1>Hello, from React-Router!</h1>
      </section>
    );
  }
}
