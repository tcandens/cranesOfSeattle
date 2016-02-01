import React, {Component, PropTypes} from 'react';
import Map from '../presenters/map.jsx';

import './mapviewport.styl';

export default class MapViewport extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    const {geojson, ...other} = this.props;
    return (
      <div className='viewport'>
        <Map geojson={geojson} {...other}/>
        {this.props.children}
      </div>
    );
  }
}

MapViewport.propTypes = {
  geojson: PropTypes.object
};
