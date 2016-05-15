import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Map from 'components/Map';
import wrapWithUserLocation from 'decorators/wrapWithUserLocation';
import Reticle from 'components/Reticle';
import CreateReport from 'components/ReportCreateForm';
import Navigation from 'components/ReportNavigation';
import StartReport from 'components/ReportStartButton';

import {
  fetchReports,
  saveReport,
  startReport,
  finishReport,
} from 'ducks/reports';

import {
  recordMapLocation,
} from 'ducks/map';

const selectReporting = (state) => {
  return {
    reports: state.reports.geojson,
    map: state.map,
    isReporting: state.reports.isReporting,
  };
};

@wrapWithUserLocation
@connect(
  selectReporting
)
export default class ReportContainer extends Component {
  state = {
    report: {},
  }
  static defaultProps = {
    latitude: 47.44,
    longitude: 122.66,
    maxBounds: [[-122.57107, 47.16157], [-122.01602, 47.78269]],
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchReports());
  }
  abortReport = () => {
    const {dispatch} = this.props;
    dispatch(finishReport());
  }
  handleStartReport = (e) => {
    const {dispatch, map} = this.props;
    dispatch(startReport(map.location));
    e.preventDefault();
  }
  handleSaveReport = (e) => {
    const {dispatch, map} = this.props;
    const {report} = this.state;
    dispatch(saveReport(map.location, report));
    e.preventDefault();
  }
  handleChangeReport = (event) => {
    const {name, value} = event.target;
    this.setState({
      report: {
        ...this.state.report,
        [name]: value,
      },
    });
  }
  mapActions = () => {
    const {dispatch} = this.props;
    return {
      onMoveEnd: (map, event) => {
        dispatch(recordMapLocation(map.getCenter()));
      },
    };
  }
  render = () => {
    const {
      reports,
      isReporting,
      longitude,
      latitude,
    } = this.props;

    return (
      <section className='c-report'>
        <Map
          accessToken={MAPBOX_TOKEN}
          style='mapbox://styles/tcandens/cik1mqp0t013490lxkh0kk9b3'
          bearing={0}
          zoom={16}
          center={[longitude, latitude]}
          actions={this.mapActions()}
          containerStyle={{
            width: '100vw',
            height: '100vh',
          }}
          sources={{
            reports: {
              type: 'geojson',
              data: reports,
            },
          }}
          layers={{
            reports: {
              id: 'reports',
              source: 'reports',
              type: 'circle',
              paint: {
                'circle-color': '#ffcc66',
              },
            },
          }}

        >
          <Reticle />
        </Map>
        <div className='c-report--forms'>
          {
            isReporting ?
            <CreateReport
              onChange={this.handleChangeReport}
              onSave={this.handleSaveReport}
              onAbort={this.abortReport}
            /> :
            <StartReport
              onStart={this.handleStartReport}
            />
          }
          <Navigation onAbort={this.abortReport} />
        </div>
      </section>
    );
  }
}
