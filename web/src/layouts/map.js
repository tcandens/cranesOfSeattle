import React from 'react';
import MapContainer from 'containers/map';
import MainLayout from 'layouts/main';
import classNames from 'classnames';

const MapLayout = (props) => {
  // Location prop is injected by route
  const {location} = props;
  const layoutClass = classNames({
    'l-map': true,
    'l-map--isMapActive': /map|cranes|report/.test(location.pathname),
    'l-map--isReporting': /report/.test(location.pathname)
  });
  return (
    <div className={layoutClass}>
      <MapContainer/>
      <MainLayout>
        {props.children}
      </MainLayout>
    </div>
  );
};

export default MapLayout;
