import React, {Component, PropTypes} from 'react';
import TransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import CreateReport from './create';
import Navigation from './nav';
import StartReport from './start';

import {
  fetchReports,
  saveReport,
  startReport,
  finishReport
} from 'ducks/reports';

@connect(
  (state) => {
    return {
      reports: state.reports,
      map: state.map,
      isReporting: state.reports.isReporting
    };
  }
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
  render = () => {
    const {isReporting} = this.props;
    return (
      <section className='c-report'>
        <div className='c-report--content'>
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
        </div>
        <Navigation onAbort={this.abortReport} />
      </section>
    );
  }
}
