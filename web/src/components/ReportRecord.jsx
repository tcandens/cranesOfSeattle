import React from 'react';

export default function ReportRecord({record}) {
  const {
    id,
    confidence,
    user_image_url,
    user_name,
  } = record.properties;
  return (
    <table className="c-report-record">
      <thead>
        <tr>
          <th>Reported By</th>
          <th>Confidence</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><img className="avatar" src={user_image_url} /></td>
          <td>{confidence}</td>
        </tr>
      </tbody>
    </table>
  );
}
