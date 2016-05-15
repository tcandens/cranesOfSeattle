import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Map from 'components/map';
import Reticle from 'components/reticle';
import CreateReport from './create';
import Navigation from './nav';
import StartReport from './start';

import {
  fetchReports,
  saveReport,
  startReport,
  finishReport
} from 'ducks/reports';

import {
  recordMapLocation
} from 'ducks/map';

const selectReporting = (state) => {
  return {
    reports: state.reports.geojson,
    map: state.map,
    isReporting: state.reports.isReporting
  };
};

@connect(
  selectReporting
)
export default class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      report: {}
    };
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
        [name]: value
      }
    });
  }
  mapActions = () => {
    const {dispatch} = this.props;
    return {
      onMoveEnd: (map, event) => {
        dispatch(recordMapLocation(map.getCenter()));
      }
    };
  }
  render = () => {
    const {
      map,
      reports,
      isReporting
    } = this.props;

    return (
      <section className='c-report'>
        <Map
          bearing={0}
          zoom={16}
          actions={this.mapActions()}
          sources={[reports]}
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
