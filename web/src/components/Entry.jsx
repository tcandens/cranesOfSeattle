import React from 'react';
import Hero from 'components/EntryHero';
import Footer from 'components/Footer';
import Prefetch from 'components/Prefetch';

export default function EntryLayout(props) {
  return (
    <div className="l-entry">
      <Hero />
      <section className="u-padded u-flex--center u-flex--column">
        <h2>Why?</h2>
        <p>Like many cities, the construction boom in Seattle has taken over
          the skyline with tower cranes. How many cranes and where they are at
        any one time is not public record, but building permits are.</p>
        <p>This project hopes to gather data from you and other users to pinpoint
        where these cranes are and any other interesting insights.</p>
      </section>
      <Footer />
      {props.children}
      <Prefetch />
    </div>
  );
}
