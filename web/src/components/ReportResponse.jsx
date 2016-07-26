import React, {PropTypes} from 'react';
import ReportRecord from 'components/ReportRecord';
import CraneRecord from 'components/CraneRecord';
import classNames from 'classnames';

export default function ReportResponse({message, result}) {
  let record;
  if (!result) {
    record = null;
  } else if (result.report && result.crane) {
    record = (
      <div>
        <ReportRecord record={result.report} />
        <CraneRecord record={result.crane} />
      </div>
    );
  } else if (!result.report && result.crane) {
    record = <CraneRecord record={result.crane} />;
  } else if (result.report && !result.crane) {
    record = <ReportRecord record={result.report} />;
  }
  const className = classNames({
    'list--vertical': true,
    'response-success--crane': result ? !!result.crane : false,
    'response-success--report': result ? !!result.report : false,
  });
  return (
    <ul className={className}>
      <div className="response-effect" />
      <li><h3>{message}</h3></li>
      {record}
    </ul>
  );
}

ReportRecord.propTypes = {
  message: PropTypes.string.isRequired,
  result: PropTypes.object.isRequired,
};
