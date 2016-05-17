import React from 'react';
import Navigation from 'components/Navigation';

const MainLayout = (props) => {
  return (
    <main className="l-main">
      {props.children}
      <Navigation />
    </main>
  );
};

export default MainLayout;
