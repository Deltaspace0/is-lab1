import type { Coordinates, Person } from '../interfaces.ts';

interface RowProps {
  person: Person;
  onClick: () => void;
}

export default function Row({ person, onClick }: RowProps) {
  const coordToString = ({ x, y }: Coordinates): string => {
    return `(${x}, ${y})`;
  };
  return (<tr
      onClick={onClick} 
      style={{cursor: 'pointer', userSelect: 'none'}}>
    <td>{person.id}</td>
    <td>{person.name}</td>
    <td>{coordToString(person.coordinates)}</td>
    <td>{person.creationDate?.toLocaleString()}</td>
    <td>{person.eyeColor}</td>
    <td>{person.hairColor}</td>
    <td>{`"${person.location.name}": ${coordToString(person.location)}`}</td>
    <td>{person.height}</td>
    <td>{person.birthday.toLocaleDateString()}</td>
    <td>{person.weight}</td>
    <td>{person.nationality}</td>
  </tr>);
}
