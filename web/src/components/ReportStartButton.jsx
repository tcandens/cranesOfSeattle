import React from 'react';
import CustomButton from 'components/Button';

export default function ReportStartButton({onStart}) {
  return (
    <CustomButton
      className="button-invert"
      onClick={onStart}>
        Start Report
    </CustomButton>
  );
}
