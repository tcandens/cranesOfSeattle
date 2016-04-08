import React, {Component} from 'react';
import MapContainer from 'containers/map';

import 'styles/layouts/map';

export default class MapLayout extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render = () => {
    return (
      <div className='map-layout'>
        <main className='c-content-container'>
          {this.props.children}
        </main>
        <MapContainer/>
      </div>
    );
  }
}
