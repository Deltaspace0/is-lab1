import type { JSX } from 'react';

interface RowProps {
  strings: string[];
  onClick: () => void;
}

export default function Row({ strings, onClick }: RowProps) {
  const cellElements: JSX.Element[] = [];
  for (const s of strings) {
    cellElements.push(<td>{s}</td>);
  }
  return (<tr
      onClick={onClick} 
      style={{cursor: 'pointer', userSelect: 'none'}}>
    {cellElements}
  </tr>);
}
