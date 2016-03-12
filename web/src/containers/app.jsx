import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import geojson from '../lib/geojson';

import {
  fetchReports,
  saveReport
} from '../actions/reports';
import {
  moveMap,
  setViewOnUser,
  setView
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
  }
  handleSaveReport = (event) => {
    event.preventDefault();
    const {dispatch, map} = this.props;
    const reportToSave = geojson.pointFromLngLat({
      latitude: map.currentPosition.lat,
      longitude: map.currentPosition.lng
    });
    dispatch(saveReport(reportToSave));
  }
  handleOnMapMove = (view) => {
    const {dispatch} = this.props;
    dispatch(moveMap(view));
  }
  handleOnMapStyleLoaded = () => {
    const {dispatch} = this.props;
    dispatch(fetchReports());
    dispatch(setViewOnUser());
  }
  handleOnMapLoadeed = () => {
    const {dispatch} = this.props;
  }
  render = () => {
    const {reports, map} = this.props;
    return (
      <div>
        <MapViewport
          geojson={reports.geojson}
          view={map.view}
          onMapMove={this.handleOnMapMove}
          onMapLoaded={this.handleOnMapLoaded}
          onStyleLoad={this.handleOnMapStyleLoaded}
        >
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
