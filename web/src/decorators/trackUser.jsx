import React, {Component} from 'react';
import {getUserLocation} from '../lib/geolocation';

const assign = Object.assign;

export default function(Decorated) {
  class TrackUser extends Component {
    constructor(props) {
      super(props);
    }
    componentDidMount() {
      getUserLocation()
      .then(location => {
        const {
          altitude,
          heading,
          latitude,
          longitude,
          speed
        } = location.coords
        this.setState({
          center: [longitude, latitude],
          heading,
          altitude,
          speed
        });
      });
    }
    render() {
      return <Decorated {...this.props} {...this.state} />;
    }
  }
  return TrackUser;
}
