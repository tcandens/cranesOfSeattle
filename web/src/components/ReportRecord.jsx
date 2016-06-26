import React from 'react';

export default function ReportRecord({record}) {
  const {
    id,
    confidence,
    user_image_url,
    user_name,
  } = record.properties;
  return (
    <ul className="c-report-record">
      {user_name &&
        <li className="list--row"><span>Reported By:</span>{user_name}
          <img className="avatar" src={user_image_url} />
        </li>
      }
      <li><span>ID:</span><em>{id}</em></li>
      <li><span>Confidence:</span><em>{confidence}</em></li>
    </ul>
  );
}
