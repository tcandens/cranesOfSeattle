import React, {Component, PropTypes} from 'react';
import TransitionGroup from 'react-addons-css-transition-group';
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
        <button className='c-button c-button--invert c-button--lg'
          onClick={this.abortReport}>
          Abort
        </button>
      </div>
    );
  }
  renderNavigation = () => {
    return (
      <nav className='c-navigation'>
        <Link
          onClick={this.abortReport}
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
        <div className='c-report--content'>
          <TransitionGroup
            component={SingleChild}
            transitionName='fadeup'
            transitionAppear={true}
            transitionAppearTimeout={600}
            transitionLeaveTimeout={600}
            transitionEnterTimeout={600}
          >
            {isReporting ? this.renderCreateReport() : this.renderStartReport()}
          </TransitionGroup>
        </div>
        {this.renderNavigation()}
      </section>
    );
  }
}

class SingleChild extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render = () => {
    const children = React.Children.toArray(this.props.children);
    return children[0] || null;
  }
}
