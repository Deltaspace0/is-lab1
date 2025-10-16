import type { JSX } from 'react';
import LabeledInput from './LabeledInput.tsx';

interface EnumInputProps<T extends string> {
  label: string;
  possibleValues: T[];
  value: T;
  onChange: (color: T) => void;
  validationError?: string
}

export default function EnumInput<T extends string>(props: EnumInputProps<T>) {
  const optionElements: JSX.Element[] = [];
  for (const value of props.possibleValues) {
    optionElements.push(<option value={value}>{value}</option>);
  }
  return (<LabeledInput
      label={props.label}
      validationError={props.validationError}>
    <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value as T)}>
      {optionElements}
    </select>
  </LabeledInput>);
}
