import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Map from 'components/map';
import Reticle from 'components/reticle';

import './app.styl';

class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render = () => {
    const mapActions = {
      onLoad: (map) => {
        console.log('Map loaded.', map);
      },
      onMoveEnd: (map, event) => {
        console.log(event)
      }
    }
    return (
      <Map
        bearing={90}
        latitude={47}
        longitude={-122}
        actions={mapActions}
      />
    );
  }
}

export default connect(state => {
  return state;
})(App);
