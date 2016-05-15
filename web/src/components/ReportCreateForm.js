import React, {Component} from 'react';
import {VelocityComponent} from 'velocity-react';

export default class CreateReport extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render = () => {
    const {onSave, onChange, onAbort} = this.props;
    return (
      <VelocityComponent
        runOnMount={true}
        animation={{
          opacity: 1,
          maxHeight: 500
        }}
        duration={600}
      >
        <div className='create-report u-dark-bg'>
          <form onChange={onChange}>
            <label>How many cranes do you see?
              <input name='cranesInView' type='number' min='1' max='5' defaultValue='1' step='1' />
            </label>
          </form>
          <button className='button button--invert button--lg' onClick={onSave}>
            Save Report
          </button>
          <button className='button button--invert button--lg'
            onClick={onAbort}>
            Abort
          </button>
        </div>
      </VelocityComponent>
    );
  }
}
