import React from 'react';
import {Link} from 'react-router';

export default ({onAbort}) => {
  return (
    <nav className='navigation'>
      <Link
        onClick={onAbort}
        className='button button--invert button--lg u-unicode' to='/'>
        🖚
      </Link>
    </nav>
  );
};
