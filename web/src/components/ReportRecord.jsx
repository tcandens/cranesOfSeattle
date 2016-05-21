import React, {PropTypes} from 'react';

export default function ReportRecord(props) {
  return (
    <ul className="list--vertical">
      <li>
        <em>ID:</em> <span>{props.properties.id}</span>
      </li>
      <li>
        <em>longitude:</em> <span>{props.geometry.coordinates[0]}</span>
      </li>
      <li>
        <em>latitude:</em> <span>{props.geometry.coordinates[1]}</span>
      </li>
      <li>
        <em>confidence:</em> <span>{props.properties.confidence}</span>
      </li>
    </ul>
  );
}

ReportRecord.propTypes = {
  id: PropTypes.number.isRequired,
  geometry: PropTypes.shape({
    coordinates: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
  }),
  properties: PropTypes.object,
};
