import React from 'react'

import MapViewport from './containers/mapviewport.jsx'

import './app.styl'

export default class App extends React.Component {
  render() {
    return (
      <MapViewport>
        <div className='reticle' />
      </MapViewport>
    )
  }
}
