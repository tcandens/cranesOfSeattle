import React, {Component, PropTypes} from 'react';
import Mapbox from 'mapbox-gl';

import 'mapbox-gl/css';

export default class Map extends Component {

  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    style: PropTypes.string.isRequired,
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
    containerStyle: PropTypes.object,
    zoom: PropTypes.number,
    pitch: PropTypes.number,
    minZoom: PropTypes.number,
    maxBounds: PropTypes.arrayOf(PropTypes.array),
    sources: PropTypes.object,
    layers: PropTypes.object,
    actions: PropTypes.shape({
      onLoad: PropTypes.func,
      onMoveEnd: PropTypes.func,
    }),
  };

  state = {
    loaded: false,
    sources: {},
    layers: {},
  }

  shouldComponentUpdate = (nextProps) => {
    return (
      nextProps.center !== this.props.center ||
      nextProps.sources !== this.props.sources ||
      nextProps.layers !== this.props.layers
    );
  }

  componentDidMount = () => {
    const {
      accessToken,
      style,
      sources,
      layers,
      actions,
      center,
    } = this.props;

    Mapbox.accessToken = accessToken;

    const map = this.map = new Mapbox.Map({
      container: this._mapContainer,
      center,
      style,
    });

    map.on('load', () => {
      for (let name in sources) {
        console.log('Source:', sources[name])
        map.addSource(name, sources[name]);
      }
      for (let layer in layers) {
        map.addLayer(layers[layer]);
      }
    });

    for (let event in actions) {
      map.on(event, actions[event]);
    }

  }

  componentWillUnmount = () => {
    this.map.remove();
  }

  render = () => {
    return (
      <div
        style={this.props.containerStyle || {}}
        ref={(c) => this._mapContainer = c}
        className='mapbox-gl-container'
      >
        {this.props.children}
      </div>
    );
  };
}
