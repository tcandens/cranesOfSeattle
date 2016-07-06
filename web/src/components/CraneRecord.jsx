import React from 'react';

export default function CraneRecord({record}) {
  const {
    permit,
    user_id,
  } = record.properties;
  return (
    <ul className="c-crane-record">
      <li>
        <span>Permit:</span>
        <em><a target="_blank" href={`http://web6.seattle.gov/dpd/PermitStatus/Project.aspx?id=${permit}`}>{permit}</a></em>
        <span>Reported by:</span>
        <em>{user_id}</em>
      </li>
    </ul>
  );
}
