import React from 'react';
import Navigation from 'components/Navigation';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const MainLayout = ({children, location}) => {
  return (
    <main className="l-main">
      <ReactCSSTransitionGroup
        component="div"
        className="transition-container"
        transitionName="layout"
        transitionEnterTimeout={400}
        transitionLeaveTimeout={400}
      >
        {React.cloneElement(children, {
          key: location.pathname,
        })}
      </ReactCSSTransitionGroup>
      <Navigation />
    </main>
  );
};

export default MainLayout;
