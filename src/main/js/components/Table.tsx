import type { JSX } from 'react';
import Row from './Row.tsx';

interface TableProps<T> {
  label: string;
  list: T[];
  getStrings: (elem?: T) => string[];
  onClick: (i: number) => void;
}

export default function Table<T>(props: TableProps<T>) {
  const headers = props.getStrings();
  const headerElements: JSX.Element[] = [];
  for (const header of headers) {
    headerElements.push(<th scope='col'>{header}</th>);
  }
  const rows: JSX.Element[] = [];
  for (let i = 0; i < props.list.length; i++) {
    const strings = props.getStrings(props.list[i]);
    rows.push(<Row strings={strings} onClick={() => props.onClick(i)}/>);
  }
  return (<>
    <p className='text' style={{fontSize: '16px'}}>{props.label}</p>
    <div className='table-div'>
      <table>
        <thead>
          <tr>{headerElements}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  </>);
}
