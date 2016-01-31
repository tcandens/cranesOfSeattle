import React from 'react'
import Map from '../presenters/map.jsx'

import './mapviewport.styl'

const {PropTypes, Component} = React;

export default class MapViewport extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  static propTypes = {

  }
  static defaultProps = {

  }
  render = () => {
    return (
      <div className='viewport'>
        <Map {...this.props} />
        {this.props.children}
      </div>
    )
  }
}
