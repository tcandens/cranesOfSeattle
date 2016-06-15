import React from 'react';

export default function ReportRecord({record}) {
  const {
    id,
    confidence,
  } = record.properties;
  return (
    <ul className="c-report-record list--row">
      <li><span>ID:</span><em>{id}</em></li>
      <li><span>Confidence:</span><em>{confidence}</em></li>
    </ul>
  );
}
