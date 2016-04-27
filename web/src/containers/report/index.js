import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {
  fetchReports,
  saveReport
} from 'ducks/reports';

@connect(
  (state) => {
    return {
      reports: state.reports,
      map: state.map,
      userId: state.user.profile.id
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
    const {dispatch, map, userId} = this.props;
    const {location} = map;
    dispatch(saveReport({location, properties: {userId}}));
    e.preventDefault();
  }
  render = () => {
    return (
      <section className='c-report'>
        <button className='c-button c-button--invert c-button--lg' onClick={this.handleStartReport}>
          Add Report
        </button>
        <Link className='c-button c-button--invert c-button--lg u-unicode' to='/'>🖚</Link>
      </section>
    );
  }
}
