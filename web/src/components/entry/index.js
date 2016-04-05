import React, {Component, PropTypes} from 'react';

import './entry.styl';

export default class Entry extends Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    return (
      <div>
        <h1>Hello, from React-Router!</h1>
        <div className='bg' />
      </div>
    );
  }
}
