import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import geojson from '../lib/geojson';

import {
  fetchReports,
  saveReport
} from '../actions/reports';
import {
  moveMap
} from '../actions/map';

import MapViewport from './mapviewport.jsx';
import Reticle from '../components/reticle.jsx';

import './app.styl';

class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  componentDidMount = () => {
    const {dispatch} = this.props;
    dispatch(fetchReports());
  }
  handleSaveReport = (event) => {
    const {dispatch, map} = this.props;
    event.preventDefault();
    const reportToSave = geojson.pointFromLngLat(map.mapPosition);
    dispatch(saveReport(reportToSave));
  }
  handleOnMapMove = (item) => {
    const {dispatch} = this.props;
    dispatch(moveMap(item));
  }
  render = () => {
    const {reports} = this.props;
    return (
      <div>
        <MapViewport geojson={reports.geojson} onMapMove={this.handleOnMapMove}>
          <Reticle />
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
