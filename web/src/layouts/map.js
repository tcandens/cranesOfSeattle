import React from 'react';
import MapContainer from 'containers/map';
import MainLayout from 'layouts/main';
import classNames from 'classnames';

const MapLayout = (props) => {
  // Location prop is injected by route
  const {location} = props;
  let layoutState, isMapVisible;
  switch (location.pathname) {
    case '/report':
      layoutState = 'isReporting';
      isMapVisible = true;
      break;
    default:
      isMapVisible = false;
  }
  return (
    <div className='l-map' data-state={layoutState}>
      <MapContainer isVisible={isMapVisible}/>
      <MainLayout>
        {props.children}
      </MainLayout>
    </div>
  );
};

export default MapLayout;
