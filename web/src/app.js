import React from 'react';
import * as DOM from 'react-dom';

class Main extends React.Component {
  render() {
    return (
      <h1>Hello!</h1>
    )
  }
}

DOM.render(<Main />, document.querySelector('#root'));
