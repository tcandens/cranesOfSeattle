import React, {Component} from 'react';
import Button from './Button';

export default class Tooltips extends Component {
  state = {
    reticle: true,
  }
  handleWalkthrough = (tool) => {
    const {closeAction} = this.props;
    const toolOrder = [
      'reticle',
      'markers',
    ];
    const nextTool = toolOrder[toolOrder.indexOf(tool) + 1];
    this.setState({
      [tool]: false,
      [nextTool]: true,
    });
    if (!nextTool) closeAction();
  }
  render = () => {
    return (
      <section className="c-tooltips">
        {this.state.reticle &&
          <div className="c-tooltips--reticle">
            <h2>You are here.</h2>
            <Button
              className="button--dark"
              onClick={() => this.handleWalkthrough('reticle')}
            >
              got it
            </Button>
          </div>
        }
        {this.state.markers &&
          <div className="c-tooltips--markers">
            <h2>The color of a report shows its confidence</h2>
            <div className="c-tooltips--confidence-scale"></div>
            <Button
              className="button--dark"
              onClick={() => this.handleWalkthrough('markers')}
            >
              got it
            </Button>
          </div>
        }
      </section>
    );
  }
}
