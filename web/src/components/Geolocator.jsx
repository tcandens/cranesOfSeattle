import React from 'react';

export default function Geolocator({onClick, error}) {
  const errorCodes = {
    1: 'Ok. Don\'t share then.',
  };
  return (
    <div className="c-geolocator">
      <button className="c-geolocator--button" onClick={onClick}>Go to my position</button>
      {error &&
        <span className="c-geolocator--error">
          {errorCodes[error]}
        </span>
      }
    </div>
  );
}
