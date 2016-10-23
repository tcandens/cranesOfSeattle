import React from 'react';

export default function CraneRecord({record}) {
  const {
    permit,
    user_id,
  } = record.properties;
  return (
    <table className="c-crane-record">
      <thead>
        <tr>
          <th>Permit</th>
          <th>Reported By</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <em><a target="_blank" href={`http://web6.seattle.gov/dpd/PermitStatus/Project.aspx?id=${permit}`}>{permit}</a></em>
          </td>
          <td>
            {user_id}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
