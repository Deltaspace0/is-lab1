import type { Person } from '../interfaces.ts';

interface RowProps {
  person: Person;
  onClick: () => void;
}

export default function Row({ person, onClick }: RowProps) {
  return (<tr
      onClick={onClick} 
      style={{cursor: 'pointer', userSelect: 'none'}}>
    <td>{person.id}</td>
    <td>{person.name}</td>
    <td>{JSON.stringify(person.coordinates)}</td>
    <td>{JSON.stringify(person.creationDate)}</td>
    <td>{person.eyeColor}</td>
    <td>{person.hairColor}</td>
    <td>{JSON.stringify(person.location)}</td>
    <td>{person.height}</td>
    <td>{JSON.stringify(person.birthday)}</td>
    <td>{person.weight}</td>
    <td>{person.nationality}</td>
  </tr>);
}
