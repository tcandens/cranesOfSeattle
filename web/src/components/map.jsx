import React, {Component, PropTypes} from 'react';
import Mapbox from 'mapbox-gl';
import * as _ from 'lodash';
import {MAPBOX_KEY} from 'protected';

import './map.styl';
import 'mapbox-gl/css';

const assign = Object.assign;

export default class Map extends Component {
  constructor(props) {
    super();
    this.props = props;
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillReceiveProps(nextProps) {
    const {geojson, view} = nextProps;
    const oldProps = this.props;
    if (!_.isEqual(geojson, oldProps.geojson)) {
      if (!this.source) {
        this.addGeoJSONSource('reports', geojson);
        this.addLayerFromSource('reports');
      }
      this.updateGeoJSONSource('reports', geojson);
    }
    if (!_.isEqual(view, oldProps.view)) {
      this.setView(view);
    }
  }
  componentDidMount() {
    Mapbox.accessToken = MAPBOX_KEY;
    const {zoom, latitude, longitude, pitch} = this.props;
    const map = new Mapbox.Map({
      container: this._mapContainer,
      center: new Mapbox.LngLat(longitude, latitude),
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
    map.on('style.load', () => {
      this.props.onStyleLoad(map);
    });
  }
  render() {
    return (
      <div ref={(c) => this._mapContainer = c} className='c-mapcontainer'></div>
    );
  }
  setView = (view) => {
    const map = this.map;
    const {latitude, longitude} = view;
    if (latitude || longitude) {
      map.panTo([longitude, latitude]);
    }
    return this;
  }
  togglePitch = () => {
    const map = this.map;
    const {pitch} = this.props;
    const priorPitch = map.getPitch();
    const changedPitch = priorPitch === 0 ? pitch : 0;
    this.setState({pitch: changedPitch});
    map.easeTo({pitch: changedPitch});
    return this;
  }
  addGeoJSONSource = (name, geojson) => {
    this.source = {};
    this.source[name] = new Mapbox.GeoJSONSource({
      data: geojson
    });
    this.map.addSource(name, this.source[name]);
    return this;
  }
  updateGeoJSONSource = (name, geojson) => {
    this.source[name].setData(geojson);
    return this;
  }
  addLayerFromSource = (name) => {
    this.map.addLayer({
      'id': name,
      'type': 'symbol',
      'source': name,
      'layout': {
        'icon-image': 'default_marker',
        'text-field': 'Report!',
        'text-anchor': 'top'
      }
    });
    return this;
  }
}

Map.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  zoom: PropTypes.number,
  pitch: PropTypes.number,
  rotate: PropTypes.number,
  data: PropTypes.shape({
    geojson: PropTypes.obj
  }),
  onMoveMap: PropTypes.func,
  onStyleLoad: PropTypes.func,
  onMapLoaded: PropTypes.func
};
Map.defaultProps = {
  latitude: 47.67994,
  longitude: -122.3733,
  zoom: 15,
  pitch: 45,
  rotate: 0
};
