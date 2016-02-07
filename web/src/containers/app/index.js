import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  fetchReports
} from '../../actions/reports';

import Map from 'components/map';
import Reticle from 'components/reticle';

import './app.styl';

class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render = () => {
    const {dispatch, reports} = this.props;

    const mapActions = {
      onLoad: (map) => {
        // console.log('Map loaded.', map);
        dispatch(fetchReports())
      },
      onMoveEnd: (map, event) => {
        // console.log(map.getCenter());
      }
    };
    const GEOJSON = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [-122.332152, 47.609831]
          }
        }
      ],
      'properties': {
        'name': 'TEST'
      }
    };

    return (
      <Map
        bearing={90}
        latitude={47.44}
        longitude={-122.66}
        actions={mapActions}
        data={[reports]}
      />
    );
  }
}

export default connect(state => {
  return state;
})(App);
