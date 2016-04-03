import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  fetchReports,
  addReport,
  saveReport
} from 'actions/reports';
import {
  fetchCranes,
  addCrane,
  saveCrane
} from 'actions/cranes';
import {
  recordMapLocation
} from 'actions/map';

import Map from 'components/map';
import Reticle from 'components/reticle';

import './app.styl';

@connect(state => state)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount = () => {
    const {dispatch} = this.props;
    dispatch(fetchReports());
    dispatch(fetchCranes());
  };

  render = () => {
    const {dispatch, reports, cranes, map} = this.props;

    const mapActions = {
      onMoveEnd: (map, event) => {
        dispatch(recordMapLocation(map.getCenter()));
      }
    };

    function handleReportClick(event) {
      event.preventDefault();
      dispatch(saveCrane(map.location));
    }

    return (
      <section>
        <Map
          bearing={90}
          zoom={15}
          data={[reports.geojson, cranes.geojson]}
          actions={mapActions}
        >
          <Reticle />
        </Map>
        <button className='c-report-button' onClick={handleReportClick}>Report</button>
      </section>
    );
  };
}
