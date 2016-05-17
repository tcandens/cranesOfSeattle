import React from 'react';
import Hero from 'components/EntryHero';

export default function EntryLayout(props) {
  return (
    <div className='l-entry'>
      <Hero />
      <section>
        <h2>Here is how you can help</h2>
        <p>If you see a crane, drop a pin on the map and report it</p>
      </section>
      {props.children}
    </div>
  );
}
