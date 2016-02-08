import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  fetchReports,
  addReport
} from 'actions/reports';
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
  };

  render = () => {
    const {dispatch, reports, map} = this.props;

    const mapActions = {
      onMoveEnd: (map, event) => {
        dispatch(recordMapLocation(map.getCenter()));
      }
    };

    function handleReportClick(event) {
      event.preventDefault();
      dispatch(addReport(map.location));
    }

    return (
      <section>
        <Map
          bearing={90}
          zoom={15}
          data={reports.geojson}
          actions={mapActions}
        >
          <Reticle />
        </Map>
        <button className='c-report-button' onClick={handleReportClick} />
      </section>
    );
  };
}

// export default App;

// export default connect(state => {
//   return state;
// })(App);
