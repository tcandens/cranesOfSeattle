import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {
  recordMapLocation
} from 'actions/map';

import MapLoader from 'components/map/loader';

@connect(state => state)
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
    const {dispatch} = this.props;
    const mapActions = {
      onMoveEnd: (map, event) => {
        dispatch(recordMapLocation(map.getCenter()));
      }
    };

    return (
      <div>
        {!('Map' in this.state) ? <p>Loading...</p> :
        <this.state.Map
          bearing={90}
          zoom={16}
          actions={mapActions}
          sources={[]}
        />}
      </div>
    );
  }
}
