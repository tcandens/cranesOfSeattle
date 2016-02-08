import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  fetchReports
} from 'actions/reports';

import Map from 'components/map';
import Reticle from 'components/reticle';

import './app.styl';

class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount = () => {
    const {dispatch} = this.props;
    dispatch(fetchReports());
  };

  render = () => {
    const {reports} = this.props;

    return (
      <div>
        <Map
          bearing={90}
          zoom={15}
          data={reports.geojson}
        />
        <Reticle />
      </div>
    );
  };
}

export default connect(state => {
  return state;
})(App);
