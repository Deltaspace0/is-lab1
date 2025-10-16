import type { JSX } from 'react';
import Row from './Row.tsx';
import type { Person } from '../interfaces.ts';

interface TableProps {
  personList: Person[];
  onClick: (i: number) => void;
}

export default function Table({ personList, onClick }: TableProps) {
  const rows: JSX.Element[] = [];
  for (let i = 0; i < personList.length; i++) {
    rows.push(<Row person={personList[i]} onClick={() => onClick(i)}/>);
  }
  return (<div className='table-div'>
    <table>
      <thead>
        <tr>
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
