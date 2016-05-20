import React, {PropTypes} from 'react';
import classNames from 'classnames';
import Button from 'components/Button';

export default function Modal(props) {
  const {
    type,
    children,
    action,
  } = props;
  const className = classNames({
    'modal': true,
    'modal--success': type ? 'success' : false,
  });
  return (
    <div className={className}>
      {children}
      <Button onClick={action} >OK</Button>
    </div>
  );
}

Modal.propTypes = {
  type: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};
