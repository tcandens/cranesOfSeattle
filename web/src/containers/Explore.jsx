import React, {Component} from 'react';
import {connect} from 'react-redux';
import Map from 'components/Map';
import Geolocator from 'components/Geolocator';
import Reticle from 'components/Reticle';
import Modal from 'components/Modal';
import ReportRecord from 'components/ReportRecord';
import CraneRecord from 'components/CraneRecord';

import {
  fetchReports,
} from 'ducks/reports';

import {
  fetchCranes,
} from 'ducks/cranes';

import {
  fetchUserLocation,
} from 'ducks/map';

function selectExploring(state) {
  return {
    reports: state.reports.geojson,
    cranes: state.cranes.geojson,
    longitude: state.map.location.lng,
    latitude: state.map.location.lat,
    map: state.map,
  };
}

@connect(
  selectExploring,
)
export default class ExploreContainer extends Component {
  state = {
    viewing: [],
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
  getUserPosition = () => {
    const {dispatch} = this.props;
    dispatch(fetchUserLocation());
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
      // touchend: (map, event) => {
      //   console.log(map, event);
      //   setViewing.call(this, map, event);
      // },
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
    } = this.props;

    const mapSources = {
      reports: {
        type: 'geojson',
        data: reports,
        cluster: true,
        maxzoom: 18,
        clusterMaxZoom: 17,
        clusterRadius: 30,
      },
      cranes: {
        type: 'geojson',
        data: cranes,
      },
    };
    const mapLayers = [
      {
        id: 'reports--high',
        source: 'reports',
        type: 'circle',
        paint: {
          'circle-color': '#ff5566',
          'circle-radius': 25,
          'circle-blur': 1,
        },
        filter: ['>', 'confidence', 2],
      },
      {
        id: 'reports--low',
        source: 'reports',
        type: 'circle',
        paint: {
          'circle-color': '#ffcc66',
          'circle-radius': 50,
          'circle-blur': 1.5,
        },
        filter: ['<=', 'confidence', 2],
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
          sources={mapSources}
          layers={mapLayers}
        >
          <Geolocator onClick={this.getUserPosition} />
          <Reticle />
        </Map>
        {this.state.viewing.length ? this.renderViewing() : null}
      </section>
    );
  }
}
