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
  return (<div className='table-div'>
    <table>
      <thead>
        <tr>
          <th scope='col'></th>
          <th scope='col'>ID</th>
          <th scope='col'>Name</th>
          <th scope='col'>Coordinates</th>
          <th scope='col'>Creation date</th>
          <th scope='col'>Eye color</th>
          <th scope='col'>Hair color</th>
          <th scope='col'>Location</th>
          <th scope='col'>Height</th>
          <th scope='col'>Birthday</th>
          <th scope='col'>Weight</th>
          <th scope='col'>Nationality</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  </div>);
}
