import React from 'react';
import MapContainer from 'containers/map';
import MainLayout from 'layouts/main';
import classNames from 'classnames';

const MapLayout = (props) => {
  // Location prop is injected by route
  const {location} = props;
  const isMapActive = /map|cranes|report/.test(location.pathname);
  const isReporting = /report/.test(location.pathname);
  const layoutClass = classNames({
    'l-map': true,
    'l-map--isMapActive': isMapActive,
    'l-map--isReporting': isReporting
  });
  return (
    <div className={layoutClass}>
      <MapContainer isActive={isMapActive}/>
      <MainLayout>
        {props.children}
      </MainLayout>
    </div>
  );
};

export default MapLayout;
