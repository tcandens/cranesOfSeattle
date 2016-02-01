import React, {Component, PropTypes} from 'react';
import Mapbox from 'mapbox-gl';
import assign from 'lodash/object/assign';
import isEmpty from 'lodash/object/isempty';
import {MAPBOX_KEY} from 'protected';

import './map.styl';
import 'mapbox-gl/css';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    const stateFromProps = this.getStateFromProps({}, props);
    this.state = assign({}, stateFromProps);
  }
  shouldComponentUpdate() {
    return false;
  }
  getStateFromProps = (state, props) => {
    const stateChanges = {
      center: props.center,
      zoom: props.zoom,
      pitch: props.pitch
    };
    return stateChanges;
  }
  componentWillReceiveProps(nextProps) {
    const map = this.getMap();
    const {geojson} = nextProps;
    if (!isEmpty(geojson)) {
      if (!map.loaded()) {
        map.on('load', () => {
          this.addGeoJSON(geojson);
        });
        return;
      }
      this.addGeoJSON(geojson);
    }
  }
  componentDidMount() {
    Mapbox.accessToken = MAPBOX_KEY;
    const {center, zoom, pitch} = this.props;
    const map = new Mapbox.Map({
      container: this._mapContainer,
      center: new Mapbox.LngLat(center[0], center[1]),
      maxBounds: new Mapbox.LngLatBounds(
        new Mapbox.LngLat(-122.57107, 47.16157),
        new Mapbox.LngLat(-122.01602, 47.78269)
      ),
      zoom: zoom,
      minZoom: 9.5,
      pitch: pitch,
      style: 'mapbox://styles/tcandens/cik1mqp0t013490lxkh0kk9b3',
      hash: false
    });
    this.map = map;

    map.on('click', () => {
      this.togglePitch();
    });
    map.on('moveend', () => {
      this.onMoveEnd();
    });
  }
  render() {
    return (
      <div ref={(c) => this._mapContainer = c} className='map-container'></div>
    );
  }
  getMap = () => {
    return this.map;
  }
  togglePitch = () => {
    const map = this.getMap();
    const {pitch} = this.props;
    const priorPitch = map.getPitch();
    const changedPitch = priorPitch === 0 ? pitch : 0;
    this.setState({pitch: changedPitch});
    map.easeTo({pitch: changedPitch});
  }
  onMoveEnd = () => {
    const map = this.getMap();
    const changedCenter = map.getCenter();
    this.setState({center: changedCenter});
    window.console.log(this.state.center);
  }
  addGeoJSON = (geojson) => {
    const map = this.getMap();
    const sourceName = 'geojson' + Date.now();
    const source = new Mapbox.GeoJSONSource({
      data: geojson
    });
    map.addSource(sourceName, source);
    map.addLayer({
      'id': sourceName,
      'type': 'symbol',
      'source': sourceName,
      'layout': {
        'icon-image': 'default_marker',
        'text-field': 'Report!',
        'text-anchor': 'top'
      }
    });
  }
}

Map.propTypes = {
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired,
  pitch: PropTypes.number,
  rotate: PropTypes.number,
  geojson: PropTypes.object,
  actions: PropTypes.shape({
    onMove: PropTypes.func
  })
};
Map.defaultProps = {
  center: [
    -122.38733,
    47.676994
  ],
  zoom: 15,
  pitch: 45,
  rotate: 0
};
