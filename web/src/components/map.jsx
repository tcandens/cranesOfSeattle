import React from 'react'
import ol from 'openlayers'

import 'openlayers/css/ol.css'
import './map-styles.css'

export default class Map extends React.Component {
  componentDidMount() {
    const view = new ol.View({
      center: [22, 144],
      zoom: 5
    });
    const map = new ol.Map({
      layers: [
        new ol.layer.Tile({source: new ol.source.OSM()})
      ],
      view: view,
      target: this.refs.map
    });
    const geolocation = new ol.Geolocation({
      tracking: true
    });
    geolocation.on('change', (e) => {
      const coords = geolocation.getPosition();
      view.setCenter(ol.proj.fromLonLat(coords));
    });
    this.map = map;
    this.view = view;
    this.geolocation = geolocation;
  }
  render() {
    return (
      <div ref='map' onClick={this.onClick} onMouseUp={this.onDrag} className='map-container'></div>
    )
  }
  onClick = (e) => {
    // const coords = ;
    window.console.log(this.geolocation)
  }
  onDrag(e) {
  }
}
