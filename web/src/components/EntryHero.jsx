import React from 'react';
import classNames from 'classnames';
import CallToAction from './CallToAction.jsx';

export default function EntryLayout() {
  const entryClass = classNames({
    'l-entry__hero': true,
  });
  return (
    <section className={entryClass}>
      <div className="c-headline c-headline--lg">
        <h2>Help us find where the cranes roost.</h2>
      </div>
      <CallToAction />
    </section>
  );
}
