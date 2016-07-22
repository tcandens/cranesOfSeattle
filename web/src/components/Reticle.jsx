import React, {Component, PropTypes} from 'react';
import MapboxGL from 'mapbox-gl/dist/mapbox-gl';

export default class Reticle extends Component {
  componentDidMount = () => {
    const {
      map,
    } = this.context;
    const {
      className,
    } = this.props;
    if (!map) throw new Error('Reticle must be used inside of a map.');
    const element = document.createElement('div');
    element.className = className;
    const marker = new MapboxGL.Marker(element)
    .setLngLat(map.getCenter())
    .addTo(map);
    map.on('move', () => {
      marker.setLngLat(map.getCenter());
    });
  }
  render = () => null;
}

Reticle.contextTypes = {
  map: PropTypes.object.isRequired,
};
Reticle.defaultProps = {
  className: 'reticle',
};
