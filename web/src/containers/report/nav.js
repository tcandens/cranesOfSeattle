import React from 'react';
import {Link} from 'react-router';

export default ({onAbort}) => {
  return (
    <nav className='c-navigation'>
      <Link
        onClick={onAbort}
        className='c-button c-button--invert c-button--lg u-unicode' to='/'>
        🖚
      </Link>
    </nav>
  );
};
