import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  recordMapLocation
} from 'actions/map';

import Map from 'components/map';

@connect(state => state)
export default class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render = () => {
    const {dispatch} = this.props;
    const mapActions = {
      onMoveEnd: (map, event) => {
        dispatch(recordMapLocation(map.getCenter()));
      }
    };

    return (
      <Map
        bearing={90}
        zoom={16}
        actions={mapActions}
        sources={[]}
      />
    );
  }
}
