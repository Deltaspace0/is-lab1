import type { JSX } from 'react';
import Row from './Row.tsx';
import type { Person } from '../interfaces.ts';

interface TableProps {
  personList: Person[];
  onDelete: () => void;
}

export default function Table({ personList, onDelete }: TableProps) {
  const rows: JSX.Element[] = [];
  for (const person of personList) {
    rows.push(<Row person={person} onDelete={onDelete}/>);
  }
  return <div className='flex-column'>{rows}</div>;
}
