import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
  requestReports,
  receiveReports,
  fetchReports
} from '../actions/reports';

import MapViewport from './containers/mapviewport.jsx';

import './app.styl';

class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchReports());
  }
  render() {
    const {reports} = this.props;
    return (
      <MapViewport geojson={reports.geojson}>
        <div className='reticle' />
      </MapViewport>
    );
  }
}

export default connect(state => {
  return state;
})(App);
