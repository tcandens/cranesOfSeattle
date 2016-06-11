import React, {Component} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import Map from 'components/Map';
import Geolocator from 'components/Geolocator';
import Reticle from 'components/Reticle';
import CreateReport from 'components/ReportCreateForm';
import StartReport from 'components/ReportStartButton';
import Modal from 'components/Modal';
import ReportRecord from 'components/ReportRecord';
import LoadingBar from 'components/LoadingBar';

import {
  fetchReports,
  saveReport,
  startReport,
  finishReport,
  confirmSaveSuccess,
} from 'ducks/reports';

import {
  fetchCranes,
} from 'ducks/cranes';

import {
  recordMapLocation,
  fetchUserLocation,
} from 'ducks/map';

function selectReporting(state) {
  return {
    reports: state.reports.geojson,
    reported: state.reports.reported,
    map: state.map,
    isReporting: state.reports.isReporting,
    longitude: state.map.location.lng,
    latitude: state.map.location.lat,
    isSaveSuccess: state.reports.isSaveSuccess,
    isSaving: state.reports.isSaving,
    cranes: state.cranes.geojson,
  };
}

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
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchCranes());
    dispatch(fetchReports());
    dispatch(fetchUserLocation());
  }
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      longitude: nextProps.longitude,
      latitude: nextProps.latitude,
    });
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
  handleConfirmSuccess = (e) => {
    e.preventDefault();
    const {dispatch} = this.props;
    dispatch(confirmSaveSuccess());
  }
  getUserPosition = () => {
    const {dispatch} = this.props;
    dispatch(fetchUserLocation());
  }
  mapActions = () => {
    const {dispatch} = this.props;
    const sendMapCenter = (map) => dispatch(recordMapLocation(map.getCenter()));
    return {
      moveend: (map) => {
        // Pop to the end of the stack for zoom events to avoid loop
        window.setTimeout(() => sendMapCenter(map), 0);
      },
      click: (map, event) => {
        const threshold = 10;
        const {x, y} = event.point;
        const features = map.queryRenderedFeatures(
          [
            [x - threshold / 2, y - threshold / 2],
            [x + threshold / 2, y + threshold / 2],
          ],
          {layers: ['reports']}
        );
        console.log(features);
      },
    };
  }

  render = () => {
    const {
      reports,
      reported,
      isReporting,
      longitude,
      latitude,
      isSaveSuccess,
      isSaving,
      cranes,
    } = this.props;

    const mapSources = {
      reports: {
        type: 'geojson',
        data: reports,
        cluster: true,
        maxzoom: 17,
        clusterRadius: 50,
      },
      cranes: {
        type: 'geojson',
        data: cranes,
      },
    };
    const mapLayers = [
      {
        id: 'reports',
        source: 'reports',
        type: 'circle',
        paint: {
          'circle-color': '#ffcc66',
          'circle-radius': 50,
          'circle-blur': 1.5,
        },
      },
      {
        id: 'cranes',
        source: 'cranes',
        type: 'symbol',
        layout: {
          'icon-image': 'cranes',
          'icon-offset': [-10, -10],
        },
      },
    ];

    const containerState = classNames({
      isReporting,
    });

    return (
      <section className="c-report" data-state={containerState}>
        <Map
          accessToken={MAPBOX_TOKEN}
          style="mapbox://styles/tcandens/cik1mqp0t013490lxkh0kk9b3"
          bearing={45}
          zoom={16}
          pitch={30}
          center={[longitude, latitude]}
          actions={this.mapActions()}
          maxBounds={[[-122.57107, 47.16157], [-122.01602, 47.78269]]}
          sources={mapSources}
          layers={mapLayers}
        >
          <Geolocator onClick={this.getUserPosition} />
          <Reticle />
        </Map>
        <div className="c-report--forms">
          { isSaving ? <LoadingBar /> : null }
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
        { isSaveSuccess ?
          <Modal type="success"
            action={this.handleConfirmSuccess}
          >
            <ReportRecord
              {...reported[reported.length - 1]}
            />
          </Modal>
          : null
        }
      </section>
    );
  }
}
