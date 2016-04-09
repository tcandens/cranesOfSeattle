import React, {Component} from 'react';
import MapContainer from 'containers/map';
import classNames from 'classnames';

import 'styles/layouts/map';

export default class MapLayout extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render = () => {
    // Location prop comes from react-router
    const {location} = this.props;
    const layoutClass = classNames({
      'map-layout': true,
      'map-layout--isMapActive': location.pathname === '/map'
    });
    return (
      <div className={layoutClass}>
        <main className='c-content-container'>
          {this.props.children}
        </main>
        <MapContainer/>
      </div>
    );
  }
}
