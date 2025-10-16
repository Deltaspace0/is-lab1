import type { JSX } from 'react';

interface EnumInputProps<T extends string> {
  label: string;
  possibleValues: T[];
  value: T;
  onChange: (color: T) => void;
}

export default function EnumInput<T extends string>(props: EnumInputProps<T>) {
  const optionElements: JSX.Element[] = [];
  for (const value of props.possibleValues) {
    optionElements.push(<option value={value}>{value}</option>);
  }
  return (<label>
    <p className='text'>{props.label}:</p>
    <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value as T)}>
      {optionElements}
    </select>
  </label>);
}
