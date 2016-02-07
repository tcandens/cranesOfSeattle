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
  componentDidMount = () => {
    this.props.dispatch(fetchReports());
  }
  render = () => {
    const {reports} = this.props;

    return (
      <Map
        bearing={90}
        latitude={47.44}
        longitude={-122.66}
        data={reports.geojson}
      />
    );
  }
}

export default connect(state => {
  return state;
})(App);
