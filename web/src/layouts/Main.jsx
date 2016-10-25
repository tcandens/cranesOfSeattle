import React, {Component} from 'react';
import {connect} from 'react-redux';
import Navigation from '../components/Navigation';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import LoadingBar from '../components/LoadingBar';

function selectLoading(state) {
  return {
    isLoading: state.map.isLoading,
  };
}

@connect(
  selectLoading
)
export default class MainLayout extends Component {
  render = () => {
    const {
      children,
      location,
      isLoading,
    } = this.props;
    return (
      <main className="l-main">
        <ReactCSSTransitionGroup
          component="div"
          className="transition-container"
          transitionName="fade"
          transitionAppear={true}
          transitionAppearTimeout={400}
          transitionEnterTimeout={400}
          transitionLeaveTimeout={400}
        >
          {React.cloneElement(children, {
            key: location.pathname,
          })}
        </ReactCSSTransitionGroup>
        {isLoading &&
          <LoadingBar />
        }
        <Navigation />
      </main>
    );
  }
}
