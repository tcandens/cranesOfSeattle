import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router';

const EntryLayout = (props) => {
  const entryClass = classNames({
    'l-entry__hero': true
  });
  return (
    <section className={entryClass}>
      <div className='c-headline c-headline--lg'>
        <h2>Help us find where the cranes roost.</h2>
      </div>
      <ul className='c-list--vertical'>
        <div className='c-button c-button--lg'>
          <Link to='/map'>View the cranes</Link>
        </div>
        <div className='c-button c-button--lg'>
          <Link to='/report'>Report a crane</Link>
        </div>
      </ul>
    </section>
  );
};

export default EntryLayout;
