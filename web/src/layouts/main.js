import React from 'react';

const MainLayout = (props) => {
  return (
    <main className='l-content'>
      {props.children}
    </main>
  );
};

export default MainLayout;
