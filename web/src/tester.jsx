import React, { Component } from 'react';

class helloComponent extends Component {
  render() {
    const {word} = this.props;
    return (
      <h1>Love you, {word}</h1>
    )
  }
}

export default helloComponent
