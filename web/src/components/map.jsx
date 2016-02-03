import React, {Component, PropTypes} from 'react';
import Mapbox from 'mapbox-gl';
import {MAPBOX_KEY} from 'protected';

import './map.styl';
import 'mapbox-gl/css';

const assign = Object.assign;

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
    if (this.source) {
      this.source.setData(geojson);
      return;
    }
    if (Object.keys(geojson).length) {
      if (!map.loaded()) {
        map.on('load', () => {
          this.addGeoJSON(geojson);
        });
        return;
      }
      this.addGeoJSON(geojson);
    }
    this.setState(this.getStateFromProps(this.state, nextProps));
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
      <div ref={(c) => this._mapContainer = c} className='c-mapcontainer'></div>
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
    const {onMapMove} = this.props;
    const changedCenter = map.getCenter();
    onMapMove(changedCenter);
    this.setState({center: changedCenter});
  }
  addGeoJSON = (geojson) => {
    const map = this.getMap();
    const sourceName = 'geojson' + Date.now();
    const source = new Mapbox.GeoJSONSource({
      data: geojson
    });
    this.source = source;
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
  onMoveMap: PropTypes.func
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
