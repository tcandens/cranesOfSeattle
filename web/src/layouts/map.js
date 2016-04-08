import React, {Component} from 'react';
import MapContainer from 'containers/map';

export default class MapLayout extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render = () => {
    return (
      <div className='map-layout'>
        {this.props.children}
        <MapContainer/>
      </div>
    );
  }
}
