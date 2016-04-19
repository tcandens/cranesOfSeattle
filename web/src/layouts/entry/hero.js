import React from 'react';
import classNames from 'classnames';
import CtaContainer from 'containers/cta';

const EntryLayout = (props) => {
  const entryClass = classNames({
    'l-entry__hero': true
  });
  return (
    <section className={entryClass}>
      <div className='c-headline c-headline--lg'>
        <h2>Help us find where the cranes roost.</h2>
      </div>
      <CtaContainer />
    </section>
  );
};

export default EntryLayout;
