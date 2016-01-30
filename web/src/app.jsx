import React from 'react'

import Map from './components/map.jsx'

export default class App extends React.Component {
  render() {
    const center = {
      lat: '22',
      lng: '-144'
    };
    return (
      <Map center={center} zoom='6'></Map>
    )
  }
}
