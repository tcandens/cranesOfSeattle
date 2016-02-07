import React, {Component, PropTypes} from 'react';
import Mapbox from 'mapbox-gl';
import {MAPBOX_KEY} from 'protected';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';

function createLayer(sourceName) {
  return {
    'id': sourceName,
    'type': 'symbol',
    'source': sourceName,
    'layout': {
      'icon-image': 'default_marker',
      'text-field': 'Report',
      'text-anchor': 'top',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold']
    }
  };
}

import './map.styl';
import 'mapbox-gl/css';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  static propTypes = {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    zoom: PropTypes.number,
    pitch: PropTypes.number,
    minZoom: PropTypes.number,
    bearing: PropTypes.number,
    maxBounds: PropTypes.arrayOf(PropTypes.array),
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),
    actions: PropTypes.shape({
      onLoad: PropTypes.func,
      onMoveEnd: PropTypes.func
    })
  }
  static defaultProps = {
    latitude: 47.44,
    longitude: 122.66,
    zoom: 10,
    pitch: 45,
    minZoom: 10,
    bearing: 0,
    maxBounds: [[-122.57107, 47.16157], [-122.01602, 47.78269]]
  }
  shouldComponentUpdate = () => {
    return false;
  }
  componentWillReceiveProps = (nextProps) => {
    const {data} = nextProps;
    if (!isEqual(this.props.data, data)) {
      this.updateSource(data);
    }
    if (Object.keys(this.sources).length === 0) {
      this.addData(data);
    }
  }
  componentDidMount = () => {
    Mapbox.accessToken = MAPBOX_KEY;
    const {data, actions, latitude, longitude, ...view} = this.props;
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

    this.sources = {};

    if (data) {
      map.on('style.load', () => {
        console.log('Map style loaded');
        this.addData(data);
      });
    }
  }
  addSource = (data) => {
    if (data.properties.name) {
      const {name} = data.properties;
      if (this.sources[name]) {
        return console.error('Data source %s already exists.', name);
      }
      const source = this.sources[name] = new Mapbox.GeoJSONSource({data});
      this.map.addSource(name, source);
      if (this.map.getLayer(name)) return;
      this.map.addLayer(createLayer(name));
    }
  }
  updateSource = (data) => {
    const {name} = data;
    this.sources[name].setData(data);
  }
  addData = (data) => {
    if (data.features || data.type === 'FeatureCollection') {
      this.addSource(data);
    }
    if (isArray(data)) {
      data.forEach(datum => this.addSource(datum));
    }
    // Add Source to map
  }
  render = () => {
    return (
      <div ref={(c) => this._mapContainer = c} className='c-mapcontainer'></div>
    );
  }
}
