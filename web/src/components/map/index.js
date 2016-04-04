import React, {Component, PropTypes} from 'react';
import Mapbox from 'mapbox-gl';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
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
    sources: PropTypes.oneOfType([
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
      loaded: false,
      sources: {}
    };
  }

  shouldComponentUpdate = () => {
    return false;
  };

  componentWillReceiveProps = (nextProps) => {
    const {sources, latitude, longitude} = nextProps;
    const currentSources = this.state.sources;
    if (!isEqual(this.props.sources, sources) || isEmpty(currentSources)) {
      sources.forEach(source => {
        const name = has(source.properties, 'name') ? source.properties['name'] : null;
        if (!name) {
          return console.log('Source has no name property. -->%s', name);
        } else if (currentSources[name]) {
          // Update currentSource with new data
          console.log('Updating source %s:', name, source);
          this.updateSource(name, source);
        } else {
          // Else create new source and layer... add data
          console.log('Adding source %s:', name, source);
          this.addSource(name, source);
        }
      });
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

  addToMap = (name, source) => {
    const map = this.map;
    const {sources} = this.state;
    sources[name] = {
      name,
      source
    };
    const layer = createLayer(name);
    console.log(layer)
    map.addSource(name, source);
    map.addLayer(layer);
    this.setState({sources});
  }

  addSource = (name, source) => {
    const {loaded} = this.state;
    const geoJSONSource = new Mapbox.GeoJSONSource({data: source});
    if (!loaded) {
      this.map.on('style.load', () => {
        this.addToMap(name, geoJSONSource);
      });
    } else {
      this.addToMap(name, geoJSONSource);
    }
  }

  updateSource = (name, source) => {
    this.state.sources[name].source.setData(source);
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
