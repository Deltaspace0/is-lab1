import type { JSX } from 'react';

interface RowProps {
  strings: string[];
  onClick: () => void;
  onClickDelete?: () => void;
}

export default function Row({ strings, onClick, onClickDelete }: RowProps) {
  const cellElements: JSX.Element[] = [];
  for (const s of strings) {
    cellElements.push(<td onClick={onClick}>{s}</td>);
  }
  if (onClickDelete) {
    cellElements.push(<td onClick={onClickDelete}>❌</td>)
  }
  return (<tr style={{cursor: 'pointer', userSelect: 'none'}}>
    {cellElements}
  </tr>);
}
