import React, {PropTypes} from 'react';

function Report({record}) {
  const {
    id,
  } = record.properties;
  return (
    <ul>
      <li><h4>Report</h4></li>
      <li><span>ID:</span><em>{id}</em></li>
    </ul>
  );
}

function Crane({record}) {
  return (
    <ul>
      <li><h4>Crane</h4></li>
      <li>{record.toString()}</li>
    </ul>
  );
}

export default function ReportRecord({message, result}) {
  let record;
  if (result.report && result.crane) {
    record = (
      <div>
        <Report record={result.report} />
        <Crane record={result.crane} />
      </div>
    );
  } else if (!result.report && result.crane) {
    record = <Crane record={result.crane} />;
  } else if (result.report && !result.crane) {
    record = <Report record={result.report} />;
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
