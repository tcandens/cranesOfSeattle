import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  recordMapLocation
} from 'ducks/map';

import MapLoader from 'components/map/loader';
import Reticle from 'components/reticle';

@connect(
  (state) => {
    return {
      reports: state.reports.geojson
    }
  }
)
export default class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  componentDidMount = () => {
    MapLoader().then(({Map}) => {
      this.setState({Map});
    });
  }
  render = () => {
    const {dispatch, reports, isActive} = this.props;
    const mapActions = {
      onMoveEnd: (map, event) => {
        dispatch(recordMapLocation(map.getCenter()));
      }
    };

    return (
      <div className='s-map'>
        {!('Map' in this.state) ? <p>Loading...</p> :
        <this.state.Map
          bearing={90}
          zoom={16}
          actions={mapActions}
          sources={[reports]}
          isActive={isActive}
        >
          <Reticle/>
        </this.state.Map>}
      </div>
    );
  }
}
