import React, {Component} from 'react';
import {connect} from 'react-redux';
import Map from 'components/Map';
import Geolocator from 'components/Geolocator';
import Reticle from 'components/Reticle';
import Modal from 'components/Modal';
import ReportRecord from 'components/ReportRecord';
import CraneRecord from 'components/CraneRecord';
import Tooltips from 'components/Tooltips';
import {createSources, layers} from './mapStyles';

import {
  fetchReports,
} from 'ducks/reports';

import {
  fetchCranes,
} from 'ducks/cranes';

import {
  fetchUserLocation,
} from 'ducks/map';

import {
  finishTooltips,
} from 'ducks/tooltips';

function selectExploring(state) {
  return {
    reports: state.reports.geojson,
    cranes: state.cranes.geojson,
    longitude: state.map.location.lng,
    latitude: state.map.location.lat,
    map: state.map,
    toolTips: state.toolTips.isFinished,
  };
}

@connect(
  selectExploring,
)
export default class ExploreContainer extends Component {
  state = {
    viewing: [],
    tooltips: true,
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
  getUserPosition = () => {
    const {dispatch} = this.props;
    dispatch(fetchUserLocation());
  }
  handleFinishTooltips = () => {
    this.props.dispatch(finishTooltips());
  }
  mapActions = () => {
    function setViewing(map, event) {
      const threshold = 10;
      const {x, y} = event.point;
      const features = map.queryRenderedFeatures(
        [
          [x - threshold / 2, y - threshold / 2],
          [x + threshold / 2, y - threshold / 2],
        ],
        {layers: ['reports--high', 'reports--low', 'cranes']}
      );
      this.setState({
        viewing: features,
      });
    }
    return {
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
      cranes,
      longitude,
      latitude,
      map,
    } = this.props;

    return (
      <section className="c-explore">
        <Map
          accessToken={MAPBOX_TOKEN}
          style="mapbox://styles/tcandens/cik1mqp0t013490lxkh0kk9b3"
          bearing={45}
          zoom={16}
          pitch={30}
          center={[longitude, latitude]}
          actions={this.mapActions()}
          maxBounds={[[-122.57107, 47.16157], [-122.01602, 47.78269]]}
          sources={createSources({reports, cranes})}
          layers={layers}
        >
          <Geolocator error={map.location.error} onClick={this.getUserPosition} />
          <Reticle/>
        </Map>
        {this.state.viewing.length ? this.renderViewing() : null}
        {!this.props.toolTips &&
          <Tooltips closeAction={this.handleFinishTooltips}/>
        }
      </section>
    );
  }
}
