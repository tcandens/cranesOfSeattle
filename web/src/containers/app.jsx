import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
  fetchReports,
  saveReport,
  moveMap
} from '../actions/reports';

import MapViewport from './mapviewport.jsx';

import './app.styl';

function createPointFromLngLat(lnglat) {
  return {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [lnglat.lng, lnglat.lat]
    },
    'properties': {
      'user_id': 11
    }
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchReports());
  }
  handleSaveReport = (event) => {
    const {dispatch, map} = this.props;
    event.preventDefault();
    const reportToSave = createPointFromLngLat(map.mapPosition);
    dispatch(saveReport(reportToSave));
  }
  handleOnMapMove = (item) => {
    const {dispatch} = this.props;
    dispatch(moveMap(item));
  }
  render() {
    const {reports} = this.props;
    return (
      <div>
        <MapViewport geojson={reports.geojson} onMapMove={this.handleOnMapMove}>
          <div className='reticle'></div>
        </MapViewport>
        <form className='drop-report'>
          <button onClick={this.handleSaveReport}>Report</button>
        </form>
      </div>
    );
  }
}

export default connect(state => {
  return state;
})(App);
