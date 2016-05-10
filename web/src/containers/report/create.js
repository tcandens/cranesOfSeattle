import React, {Component} from 'react';
import TransitionGroup from 'react-addons-css-transition-group';

export default class CreateReport extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render = () => {
    const {onSave, onChange, onAbort} = this.props;
    return (
      <TransitionGroup
        transitionName='fadeup'
        transitionAppear={true}
        transitionAppearTimeout={600}
        transitionLeaveTimeout={600}
        transitionEnterTimeout={600}
      >
        <div className='c-create-report u-dark-bg'>
          <form onChange={onChange}>
            <label>How many cranes do you see?
              <input name='cranesInView' type='number' min='1' max='5' defaultValue='1' step='1' />
            </label>
          </form>
          <button className='c-button c-button--invert c-button--lg' onClick={onSave}>
            Save Report
          </button>
          <button className='c-button c-button--invert c-button--lg'
            onClick={onAbort}>
            Abort
          </button>
        </div>
      </TransitionGroup>
    );
  }
}
