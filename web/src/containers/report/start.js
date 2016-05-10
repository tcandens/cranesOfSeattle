import React from 'react';

export default ({onStart}) => {
  return (
    <div className='start-report'>
      <button
        className='button button--invert button--lg'
        onClick={onStart}>
          Start Report
      </button>
    </div>
  );
};
