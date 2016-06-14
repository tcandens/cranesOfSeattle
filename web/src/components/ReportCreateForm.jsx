import React from 'react';

export default function ReportCreateForm(props) {
  const {onSave, onChange, onAbort} = props;
  return (
      <div className="create-report u-dark-bg">
        <form className="form-group--row" onChange={onChange}>
          <label>How many cranes do you see?</label>
          <div className="form-group--radio">
            <input id="r1" type="radio" name="visible_cranes" value="1" />
            <label htmlFor="r1">1</label>
            <input id="r2" type="radio" name="visible_cranes" value="2" />
            <label htmlFor="r2">2</label>
          </div>
        </form>
        <ul className="create-report--options list--row">
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
