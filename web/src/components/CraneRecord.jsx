import React from 'react';

export default function CraneRecord({record}) {
  const {
    permit,
  } = record.properties;
  return (
    <ul className="c-crane-record">
      <li>
        <span>Permit:</span>
        <em><a target="_blank" href={`http://web6.seattle.gov/dpd/PermitStatus/Project.aspx?id=${permit}`}>{permit}</a></em>
      </li>
    </ul>
  );
}
