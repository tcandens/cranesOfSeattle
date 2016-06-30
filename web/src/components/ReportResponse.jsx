import React, {PropTypes} from 'react';
import ReportRecord from 'components/ReportRecord';
import CraneRecord from 'components/CraneRecord';

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
  return (
    <ul className="list--vertical">
      <li><h3>{message}</h3></li>
      {record}
    </ul>
  );
}

ReportRecord.propTypes = {
  message: PropTypes.string.isRequired,
  result: PropTypes.object.isRequired,
};
