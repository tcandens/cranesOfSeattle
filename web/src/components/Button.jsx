import React from 'react';
import classNames from 'classnames';

export default function Button(props) {
  const classes = classNames('button', 'button--lg', props.className);
  return (
    <button {...props} className={classes}>{props.children}</button>
  );
}
