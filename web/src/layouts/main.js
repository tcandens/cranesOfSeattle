import React, {Component} from 'react';

export default class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render = () => {
    return (
      <main className='content-container'>
        {this.props.children}
      </main>
    );
  }
}
