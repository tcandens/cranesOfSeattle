import React from 'react';

export default function ReportCreateForm(props) {
  const {onSave, onChange, onAbort} = props;
  return (
      <div className="create-report u-dark-bg">
        <form onChange={onChange}>
          <label>How many cranes do you see?
            <input name="cranesInView" type="number" min="1" max="5" defaultValue="1" step="1" />
          </label>
        </form>
        <ul className="create-report--options">
          <li>
            <button className="button button--invert button--lg" onClick={onSave}>
              Save
            </button>
          </li>
          <li>
            <button className="button button--invert button--lg"
              onClick={onAbort}>
              X
            </button>
          </li>
        </ul>
      </div>
  );
}
