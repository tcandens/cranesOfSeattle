import React from 'react';

const MainLayout = (props) => {
  return (
    <main className='l-main'>
      {props.children}
    </main>
  );
};

export default MainLayout;
