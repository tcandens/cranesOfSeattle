import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

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
  handleStartReport = (e) => {
    const {dispatch, map} = this.props;
    dispatch(startReport(map.location));
    e.preventDefault();
  }
  handleSaveReport = (e) => {
    const {dispatch, map} = this.props;
    const {report} = this.state
    dispatch(saveReport(map.location, report));
    e.preventDefault();
  }
  handleReportChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      report: {
        ...this.state.report,
        [name]: value
      }
    });
  }
  renderStartReport = () => {
    return (
      <div className='c-start-report'>
        <button
          className='c-button c-button--invert c-button--lg'
          onClick={this.handleStartReport}>
            Start Report
        </button>
      </div>
    );
  }
  renderCreateReport = () => {
    return (
      <div className='c-create-report u-dark-bg'>
        <form onChange={this.handleReportChange}>
          <label>How many cranes do you see?
            <input name='cranesInView' type='number' min='1' max='5' defaultValue='1' step='1' />
          </label>
        </form>
        <button className='c-button c-button--invert c-button--lg' onClick={this.handleSaveReport}>
          Save Report
        </button>
      </div>
    );
  }
  renderNavigation = () => {
    const {dispatch} = this.props;
    return (
      <nav className='c-navigation'>
        <Link
          onClick={() => dispatch(finishReport())}
          className='c-button c-button--invert c-button--lg u-unicode' to='/'>
          🖚
        </Link>
      </nav>
    );
  }
  render = () => {
    const {isReporting} = this.props;
    return (
      <section className='c-report'>
        {isReporting ? this.renderCreateReport() : this.renderStartReport()}
        {this.renderNavigation()}
      </section>
    );
  }
}
