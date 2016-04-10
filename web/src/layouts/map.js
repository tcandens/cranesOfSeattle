import React, {Component} from 'react';
import MapContainer from 'containers/map';
import classNames from 'classnames';

const MapLayout = (props) => {
  const {location} = props;
  const layoutClass = classNames({
    'l-map': true,
    'l-map--isMapActive': location.pathname === '/map'
  });
  return (
    <div className={layoutClass}>
      <main className='l-content'>
        {props.children}
      </main>
      <MapContainer/>
    </div>
  );
};

export default MapLayout;
