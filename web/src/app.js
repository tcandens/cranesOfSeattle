import React from 'react';
import ReactDOM from 'react-dom';

import Test from './tester';

class Main extends React.Component {
  render() {
    return (
      <div>
        <h2>Suck about it!</h2>
        <Test></Test>
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.querySelector('#root'));
