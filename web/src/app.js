import React from 'react';
import ReactDOM from 'react-dom';

import helloFactory from './tester'

const Hello = helloFactory({React});

let word = 'world';

ReactDOM.render(<Hello word={word} />, document.getElementById('root'));
