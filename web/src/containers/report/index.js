import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  fetchReports,
  addReport,
  saveReport
} from 'actions/reports'

@connect(
  (state) => {
    return {
      reports: state.reports,
      map: state.map
    };
  }
)
export default class ReportContainer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchReports());
  }
  handleStartReport = (e) => {
    const {dispatch, map} = this.props;
    dispatch(saveReport(map.location));
    e.preventDefault();
  }
  render = () => {
    return (
      <div className='c-button c-button--lg' onClick={this.handleStartReport}>
        Add Report
      </div>
    );
  }
}
