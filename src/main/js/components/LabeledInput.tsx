import type React from 'react';

interface LabeledInputProps {
  children: React.ReactNode;
  label: string;
  validationError?: string;
}

export default function LabeledInput(props: LabeledInputProps) {
  return (<div>
    <label className={props.validationError ? 'error' : ''}>
      <p className='text'>{props.label}:</p>
      {props.children}
    </label>
    {props.validationError && <span className='error-message'>
      {props.validationError}
    </span>}
  </div>);
}
