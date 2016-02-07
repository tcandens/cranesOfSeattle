import React, {Component, PropTypes} from 'react';
import Mapbox from 'mapbox-gl';
import {MAPBOX_KEY} from 'protected';

import './map.styl';
import 'mapbox-gl/css';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  shouldComponentUpdate = () => {
    return false;
  }
  componentWillReceiveProps = (nextProps) => {
  }
  componentDidMount = () => {
    Mapbox.accessToken = MAPBOX_KEY;
    const {actions, latitude, longitude, ...view} = this.props;
    const map = this.map = new Mapbox.Map({
      container: this._mapContainer,
      center: new Mapbox.LngLat(longitude, latitude),
      ...view,
      style: 'mapbox://styles/tcandens/cik1mqp0t013490lxkh0kk9b3',
      hash: false
    });

    map.on('load', () => {
      actions.onLoad(map);
    });
    map.on('moveend', (e) => {
      actions.onMoveEnd(map, e);
    });
  }
  render = () => {
    return (
      <div ref={(c) => this._mapContainer = c} className='c-mapcontainer'></div>
    );
  }
}
Map.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  zoom: PropTypes.number,
  pitch: PropTypes.number,
  minZoom: PropTypes.number,
  bearing: PropTypes.number,
  maxBounds: PropTypes.arrayOf(PropTypes.array),
  actions: PropTypes.shape({
    onLoad: PropTypes.func
  })
};
Map.defaultProps = {
  latitude: 47.44,
  longitude: 122.66,
  zoom: 10,
  pitch: 45,
  minZoom: 10,
  bearing: 0,
  maxBounds: [[-122.57107, 47.16157], [-122.01602, 47.78269]]
};
