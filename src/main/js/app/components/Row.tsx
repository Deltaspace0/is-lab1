import type { Person } from '../interfaces.ts';

interface RowProps {
  person: Person;
  onDelete: () => void;
}

export default function Row({ person, onDelete }: RowProps) {
  const deletePerson = async () => {
    await fetch(`/person/${person.id}`, { method: 'DELETE' });
    onDelete();
  };
  return (<tr>
    <td>
      <button className='button-table' onClick={() => deletePerson()}>Delete</button>
    </td>
    <td>{person.id}</td>
    <td>{person.name}</td>
    <td>{JSON.stringify(person.coordinates)}</td>
    <td>{person.creationDate}</td>
    <td>{person.eyeColor}</td>
    <td>{person.hairColor}</td>
    <td>{JSON.stringify(person.location)}</td>
    <td>{person.height}</td>
    <td>{person.birthday}</td>
    <td>{person.weight}</td>
    <td>{person.nationality}</td>
  </tr>);
}
