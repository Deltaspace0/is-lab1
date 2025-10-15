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
  return (<div className='flex-row'>
    <button onClick={() => deletePerson()}>Delete</button>
    <p className='text'>{JSON.stringify(person)}</p>
  </div>);
}
