import React, {Component} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import MapComponent, {Source, Circles, Symbols, query} from 'mapbox-gl-react';
import MapboxGL from 'mapbox-gl/dist/mapbox-gl';
import Reticle from 'components/Reticle';
import CreateReport from 'components/ReportCreateForm';
import StartReport from 'components/ReportStartButton';
import Modal from 'components/Modal';
import LoadingBar from 'components/LoadingBar';
import ReportResponse from 'components/ReportResponse';
import ReportRecord from 'components/ReportRecord';
import CraneRecord from 'components/CraneRecord';
import Tooltips from 'components/Tooltips';
import {Link} from 'react-router';
import Button from 'components/Button';
import socketIO from 'socket.io-client';
import config from '../../config/colors.json';
const io = socketIO(window.location.origin, {path: '/api/socket.io'});
const {$colors} = config;

import {
  addReport,
  fetchReports,
  saveReport,
  startReport,
  finishReport,
  confirmSaveSuccess,
} from 'ducks/reports';

import {
  addCrane,
  fetchCranes,
} from 'ducks/cranes';

import {
  recordMapLocation,
  fetchUserLocation,
} from 'ducks/map';

import {
  finishTooltips,
} from 'ducks/tooltips';

function selectReporting(state) {
  return {
    reports: state.reports.geojson,
    cranes: state.cranes.geojson,
    reported: state.reports.reported,
    map: state.map,
    isReporting: state.reports.isReporting,
    isAuthenticated: state.user.isAuthenticated,
    longitude: state.map.location.lng,
    latitude: state.map.location.lat,
    isSaveSuccess: state.reports.isSaveSuccess,
    isSaving: state.reports.isSaving,
    toolTips: state.toolTips.isFinished,
  };
}

@connect(
  selectReporting
)
export default class ReportContainer extends Component {
  state = {
    viewing: [],
    report: {},
    toolTips: true,
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchCranes());
    dispatch(fetchReports());
    dispatch(fetchUserLocation());
    io.on('report/added', data => {
      dispatch(addReport(data));
    });
    io.on('crane/added', data => {
      dispatch(addCrane(data));
    });
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
  handleFinishTooltips = () => {
    this.props.dispatch(finishTooltips());
  }
  getUserPosition = () => {
    const {dispatch} = this.props;
    dispatch(fetchUserLocation());
  }
  mapActions = () => {
    const {dispatch} = this.props;
    function setViewing(map, event) {
      const threshold = 10;
      const features = query(map).renderedWithin(threshold, event);
      this.setState({
        viewing: features,
      });
    }
    function sendMapCenter(map) {
      dispatch(recordMapLocation(map.getCenter()));
    }
    return {
      load: (map) => {
        map.setMaxBounds([
          [-122.57107, 47.16157],
          [-122.01602, 47.78269],
        ]);
      },
      moveend: (map) => {
        // Pop to the end of the stack for zoom events to avoid loop
        window.setTimeout(() => sendMapCenter(map), 0);
      },
      click: (map, event) => {
        setViewing.call(this, map, event);
      },
    };
  }
  renderViewing = () => {
    const {
      viewing,
    } = this.state;
    const features = viewing.map((entity, index) => {
      let feature;
      if (entity.layer.id.match(/report/)) {
        feature = <ReportRecord record={entity} />;
      } else if (entity.layer.id.match(/crane/)) {
        feature = <CraneRecord record={entity} />;
      }
      return <li key={index}>{feature}</li>;
    });
    return (
      <Modal type="list" title="Nearby" action={() => {
        this.setState({viewing: []});
      }}>
        <ul>
          {features}
        </ul>
      </Modal>
    );
  }
  render = () => {
    const {
      reports,
      reported,
      isReporting,
      isAuthenticated,
      longitude,
      latitude,
      isSaveSuccess,
      isSaving,
      cranes,
      map,
      toolTips,
    } = this.props;

    const containerState = classNames({
      'isAuthenticated': isAuthenticated,
      'isReporting': isReporting,
    });

    return (
      <section className="c-report" data-state={containerState}>
        <MapComponent
          accessToken={MAPBOX_TOKEN}
          style="mapbox://styles/tcandens/cik1mqp0t013490lxkh0kk9b3"
          bearing={45}
          zoom={16}
          pitch={30}
          center={[longitude, latitude]}
          eventHandlers={this.mapActions()}
          maxBounds={[[-122.57107, 47.16157], [-122.01602, 47.78269]]}
        >
          <Reticle />
          <Source name="reports" data={reports}>
            <Circles
              blur={0.2}
              opacity={0.8}
              color={{
                property: 'confidence',
                stops: [
                [0, $colors.yellow],
                [1, $colors.salmon],
                [2, $colors.mint],
                ],
              }}
            />
          </Source>
          <Source name="cranes" data={cranes}>
            <Symbols image="crane" />
          </Source>
        </MapComponent>
        <div className="c-report--forms">
          {!isAuthenticated &&
            <Link to="/login"><Button>Login to report</Button></Link>
          }
          {isSaving && <LoadingBar />}
          {isReporting && isAuthenticated &&
            <CreateReport
              onChange={this.handleChangeReport}
              onSave={this.handleSaveReport}
              onAbort={this.abortReport}
            />
          }
          {!isReporting && isAuthenticated &&
            <StartReport
              onStart={this.handleStartReport}
            />
          }
        </div>
        {isSaveSuccess &&
          <Modal type="success"
            action={this.handleConfirmSuccess}
          >
            <ReportResponse
              {...reported[reported.length - 1]}
            />
          </Modal>
        }
        {!!this.state.viewing.length && this.renderViewing()}
        {!toolTips &&
          <Tooltips closeAction={this.handleFinishTooltips} />
        }
      </section>
    );
  }
}