import React from 'react';

export default function CraneRecord({record}) {
  const properties = Object.keys(record.properties).map((prop, index) => {
    return <li key={index}><span>{prop}:</span><em>{record.properties[prop]}</em></li>;
  });
  return (
    <ul className="list--vertical c-crane-record">
      <li>
        <h4>Crane</h4>
      </li>
      <li>
        <ul className="list--row">
          {properties}
        </ul>
      </li>
    </ul>
  );
}
