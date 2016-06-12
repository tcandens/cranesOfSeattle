import React from 'react';

export default function ReportRecord({record}) {
  const {
    id,
    confidence,
  } = record.properties;
  return (
    <ul className="c-report-record list--vertical">
      <li>
        <h4>Report</h4>
      </li>
      <li>
        <ul className="list--row">
          <li><span>ID:</span><em>{id}</em></li>
          <li><span>Confidence:</span><em>{confidence}</em></li>
        </ul>
      </li>
    </ul>
  );
}
