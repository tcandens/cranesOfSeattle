import React from 'react';
import CustomButton from './Button';

export default function ReportStartButton({onStart}) {
  return (
    <CustomButton
      className="button-invert"
      onClick={onStart}>
        Start Report
    </CustomButton>
  );
}
