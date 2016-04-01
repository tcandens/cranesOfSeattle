import React, {Component, PropTypes} from 'react';
import Mapbox from 'mapbox-gl';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import uniqueId from 'lodash/uniqueId';
import has from 'lodash/has';
import wrapWithUserLocation from 'decorators/userLocation';

const MAPBOX_STYLE = 'mapbox://styles/tcandens/cik1mqp0t013490lxkh0kk9b3';
// Mapbox key is public, deal with the privacy issues later.
const MAPBOX_KEY = 'pk.eyJ1IjoidGNhbmRlbnMiLCJhIjoiZDEzOTJmYTdkZWNjYzc3ZDA1OWE0ODJmMmRmMmFjODUifQ.6m8N0DXRDsDugoXMcGXfhQ';

import {createLayer} from './helpers';

import './map.styl';
import 'mapbox-gl/css';

@wrapWithUserLocation
export default class Map extends Component {

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
  };
  static defaultProps = {
    latitude: 47.44,
    longitude: 122.66,
    zoom: 10,
    pitch: 45,
    minZoom: 10,
    bearing: 0,
    maxBounds: [[-122.57107, 47.16157], [-122.01602, 47.78269]]
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      loaded: false
    };
  }

  shouldComponentUpdate = () => {
    return false;
  };

  componentWillReceiveProps = (nextProps) => {
    const {data, latitude, longitude} = nextProps;
    if (!isEqual(this.props.data, data)) {
      if (this.sources[data.properties.name]) {
        this.updateSource(data);
      } else {
        this.addData(data);
      }
    }
    if (Object.keys(this.sources).length === 0) {
      this.addData(data);
    }
    if (
      !isEqual(this.props.longitude, longitude) ||
      !isEqual(this.props.latitude, latitude)
    ) {
      this.updateLocation(longitude, latitude);
    }
  };

  componentDidMount = () => {
    Mapbox.accessToken = MAPBOX_KEY;
    const {data, actions, latitude, longitude, ...view} = this.props;
    const map = this.map = new Mapbox.Map({
      container: this._mapContainer,
      center: new Mapbox.LngLat(longitude, latitude),
      ...view,
      style: MAPBOX_STYLE
    });

    map.on('load', () => {
      if (has(actions, 'onLoad')) actions.onLoad(map);
    });
    map.on('moveend', (event) => {
      if (has(actions, 'onMoveEnd')) actions.onMoveEnd(map, event);
    });
    map.on('zoomend', (event) => {
      if (has(actions, 'onZoomEnd')) actions.onZoomEnd(map, event);
      if (has(actions, 'onMoveEnd')) actions.onMoveEnd(map, event);
    });
    map.on('style.load', () => {
      this.setState({loaded: true});
    });
    map.on('click', () => {
      this.togglePitch();
    });

    this.sources = {};
  };

  togglePitch = () => {
    const map = this.map;
    const {pitch} = this.props;
    const currentPitch = map.getPitch();
    const changedPitch = currentPitch === pitch ? 0 : pitch;
    map.easeTo({pitch: changedPitch});
  };

  updateLocation = (longitude, latitude) => {
    this.map.panTo([longitude, latitude]);
  };

  addSource = (data) => {
    let name = has(data, 'properties.name') ? data.properties.name : uniqueId();
    if (has(this.sources, name)) {
      return console.warn('Data source %s already exists.', name);
    }
    const source = this.sources[name] = new Mapbox.GeoJSONSource({data});
    if (this.map.getLayer(name)) return;
    if (!this.state.loaded) {
      // Add event listener to add styles at appropriate time
      this.map.on('style.load', () => {
        this.map.addSource(name, source);
        this.map.addLayer(createLayer(name));
      });
    } else {
      this.map.addSource(name, source);
      this.map.addLayer(createLayer(name));
    }
  };

  updateSource = (data) => {
    const {name} = data.properties;
    this.sources[name].setData(data);
  };

  addData = (data) => {
    if (data.features || data.type === 'FeatureCollection') {
      this.addSource(data);
    } else if (isArray(data)) {
      data.forEach(datum => this.addSource(datum));
    }
  };

  render = () => {
    return (
      <div className='c-map-container'>
        <div ref={(c) => this._mapContainer = c} className='c-map'></div>
        {this.props.children}
      </div>
    );
  };

}
