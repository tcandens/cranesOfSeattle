import React from 'react';
import connect from 'react-redux';

import Hero from 'components/EntryHero';

const EntryLayout = (props) => {
  return (
    <div className='l-entry'>
      <Hero/>
      <section>
        <h2>Here is how you can help</h2>
        <p>If you see a crane, drop a pin on the map and report it</p>
      </section>
      {props.children}
    </div>
  );
};

export default EntryLayout;
