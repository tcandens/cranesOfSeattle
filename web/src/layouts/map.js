import React from 'react';
import MapContainer from 'containers/map';
import MainLayout from 'layouts/main';

const MapLayout = (props) => {
  // Location prop is injected by route
  const {location} = props;
  let layoutState;
  switch (location.pathname) {
    case '/report':
      layoutState = 'isReporting';
      break;
  }
  return (
    <div className='l-map' data-state={layoutState}>
      <MapContainer/>
      <MainLayout>
        {props.children}
      </MainLayout>
    </div>
  );
};

export default MapLayout;
