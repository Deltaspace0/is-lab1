import { useEffect, useState } from 'react';
import type { Person } from '../interfaces.ts';
import LabeledInput from './LabeledInput.tsx';

interface PersonIdInputProps {
  onChange: (person: Person) => void;
}

export default function PersonIdInput({ onChange }: PersonIdInputProps) {
  const [currentId, setCurrentId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const findPerson = async () => {
    const response = await fetch(`/person/${currentId}`);
    if (response.ok) {
      const body = await response.json();
      onChange(body);
    } else {
      setErrorMessage('Does not exist');
    }
  };
  useEffect(() => setErrorMessage(''), [currentId]);
  return (<LabeledInput label='Person ID' validationError={errorMessage}>
    <input
      type='number'
      value={currentId}
      min='0'
      onChange={(e) => setCurrentId(Number(e.target.value))}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          findPerson();
          e.preventDefault();
        }
      }}
      style={{width: '64px'}}
    />
    <button onClick={findPerson} style={{
      width: '64px',
      height: '24px'
    }}>Find</button>
  </LabeledInput>);
}
