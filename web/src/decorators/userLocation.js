import React, {Component} from 'react';
import {getUserLocation} from '../lib/geolocation';

export default function wrapWithUserLocation(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        longitude: 0,
        latitude: 0
      };
    }
    componentDidMount = () => {
      getUserLocation().then(location => {
        const {latitude, longitude} = location.coords;
        this.setState({
          latitude,
          longitude
        });
      });
    }
    render = () => {
      return (
        <WrappedComponent {...this.props} {...this.state}/>
      );
    }
  };
}
