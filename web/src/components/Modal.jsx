import React, {PropTypes} from 'react';
import classNames from 'classnames';
import Button from './Button';

export default function Modal(props) {
  const {
    type,
    children,
    action,
    title,
  } = props;
  const className = classNames({
    'modal': true,
    'modal--list': type === 'list',
    'modal--success': type === 'success',
  });
  return (
    <div className={className}>
      {title &&
        <div className="modal--header"><h4>{title}</h4></div>
      }
      <div className="modal--body">
        {children}
      </div>
      <div className="modal--button">
        <Button onClick={action} >OK</Button>
      </div>
    </div>
  );
}

Modal.propTypes = {
  type: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};
