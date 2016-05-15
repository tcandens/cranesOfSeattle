import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  recordMapLocation
} from 'ducks/map';

import Map from 'components/map';
import Reticle from 'components/reticle';

@connect(
  (state) => {
    return {
      reports: state.reports.geojson
    };
  }
)
export default class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  render = () => {
    const {dispatch, reports} = this.props;
    const mapActions = {
      onMoveEnd: (map, event) => {
        dispatch(recordMapLocation(map.getCenter()));
      }
    };

    return (
      <Map
        bearing={0}
        zoom={16}
        actions={mapActions}
        sources={[reports]}
      >
      </Map>
    );
  }
}
