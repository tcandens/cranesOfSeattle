import React from 'react';

export default function CraneRecord({record}) {
  const {
    permit,
  } = record.properties;
  return (
    <ul className="list--vertical c-crane-record">
      <li>
        <h4>Crane</h4>
      </li>
      <li>
        <ul className="list--row">
          <li>
            <span>Permit</span>
            <em><a target="_blank" href={`http://web6.seattle.gov/dpd/PermitStatus/Project.aspx?id=${permit}`}>{permit}</a></em>
          </li>
        </ul>
      </li>
    </ul>
  );
}
