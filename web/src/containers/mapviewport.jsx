import React, {Component, PropTypes} from 'react';
import Map from '../components/map.jsx';

import './mapviewport.styl';

export default class MapViewport extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    const {geojson, view, ...other} = this.props;
    return (
      <div className='viewport'>
        <Map geojson={geojson} view={view} {...other}/>
        {this.props.children}
      </div>
    );
  }
}

MapViewport.propTypes = {
  geojson: PropTypes.object
};
