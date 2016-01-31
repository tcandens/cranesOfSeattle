import React from 'react'
import Mapbox from 'mapbox-gl'

import './map.styl'
import 'mapbox-gl/css'

const mapboxKey = process.env.mapbox_key || 'pk.eyJ1IjoidGNhbmRlbnMiLCJhIjoiZDEzOTJmYTdkZWNjYzc3ZDA1OWE0ODJmMmRmMmFjODUifQ.6m8N0DXRDsDugoXMcGXfhQ';

const {PropTypes, Component} = React;

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      map: {}
    }
  }
  static propTypes = {
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
    pitch: PropTypes.number,
    rotate: PropTypes.number,
    actions: PropTypes.shape({
      onMove: PropTypes.func
    })
  }
  static defaultProps = {
    center: [
      -122.3393288,
      47.6087215
    ],
    zoom: 15,
    pitch: 45,
    rotate: 0
  }
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {
    Mapbox.accessToken = mapboxKey;
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
    map.on('click', (e) => {
      const priorPitch = map.getPitch();
      const togglePitch = priorPitch === 0 ? pitch : 0;
      map.easeTo({pitch: togglePitch});
    });
    map.on('moveend', (e) => {
      const coords = map.getCenter();
      window.console.log(coords);
    });
    this.setState({map: map});
  }
  render() {
    return (
      <div ref={(c) => this._mapContainer = c} className='map-container'></div>
    )
  }
}
