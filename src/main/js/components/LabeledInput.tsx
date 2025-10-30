import type React from 'react';

interface LabeledInputProps {
  children: React.ReactNode;
  label?: string;
  validationError?: string;
}

export default function LabeledInput(props: LabeledInputProps) {
  return (<div>
    {props.label ? (<label className={props.validationError ? 'error' : ''}>
      <p className='text' style={{marginLeft: 'auto'}}>{props.label}:</p>
      {props.children}
    </label>) : (<div className='flex-row'>{props.children}</div>)}
    {props.validationError && <span className='error-message'>
      {props.validationError}
    </span>}
  </div>);
}
