import React from 'react';

export default ({onStart}) => {
  return (
    <div className='c-start-report'>
      <button
        className='c-button c-button--invert c-button--lg'
        onClick={onStart}>
          Start Report
      </button>
    </div>
  );
};
