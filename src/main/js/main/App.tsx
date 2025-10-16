import '../App.css'
import { useCallback, useEffect, useState } from 'react';
import Table from '../components/Table.tsx';
import type { Person } from '../interfaces.ts';
import PersonInput from '../components/PersonInput.tsx';

type Panel = 'add' | 'edit' | 'table';
const defaultPerson: Person = {
  id: 0,
  name: '',
  coordinates: {
    x: 0,
    y: 0
  },
  eyeColor: 'BLACK',
  hairColor: 'BLACK',
  location: {
    name: '',
    x: 0,
    y: 0
  },
  height: 0,
  birthday: new Date('2000-01-01'),
  weight: 0,
  nationality: 'RUSSIA'
};

export default function App() {
  const [panel, setPanel] = useState<Panel>('table');
  const [personList, setPersonList] = useState<Person[]>([]);
  const [editId, setEditId] = useState(0);
  const [editPerson, setEditPerson] = useState<Person>(defaultPerson);
  const deserializePerson = (person: Person): Person => {
    if (person.creationDate) {
      person.creationDate = new Date(person.creationDate);
    }
    person.birthday = new Date(person.birthday);
    return person;
  }
  const refreshList = useCallback(async () => {
    const response = await fetch('/person');
    const body: Person[] = await response.json();
    setPersonList(body.map(deserializePerson));
  }, []);
  useEffect(() => void refreshList(), [refreshList]);
  useEffect(() => {
    if (editId <= 0) {
      return;
    }
    (async () => {
      const response = await fetch(`/person/${editId}`);
      const body: Person = await response.json();
      setEditPerson(deserializePerson(body));
    })();
  }, [editId]);
  const deletePerson = async () => {
    await fetch(`/person/${editPerson.id}`, { method: 'DELETE' });
    setPanel('table');
    refreshList();
  };
  const addPerson = async () => {
    await fetch(`/person`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editPerson)
    });
    setPanel('table');
    refreshList();
  };
  const updatePerson = async () => {
    await fetch(`/person/${editPerson.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editPerson)
    });
    setPanel('table');
    refreshList();
  };
  const handleTableClick = (i: number) => {
    setEditId(personList[i].id);
    setPanel('edit');
  }
  const panels = {
    add: <fieldset style={{width: '250px'}}>
      <legend>Add person</legend>
      <PersonInput
        person={editPerson}
        onChange={(person) => setEditPerson({...person})}
      />
      <button onClick={addPerson}>Add</button>
    </fieldset>,
    edit: <fieldset style={{width: '250px'}}>
      <legend>Edit person</legend>
      <p className='text'>ID: {editId > 0 ? editId : 'None'}</p>
      {editId > 0 && <>
        <PersonInput
          person={editPerson}
          onChange={(person) => setEditPerson({...person})}
        />
        <div className='flex-row'>
          <button onClick={updatePerson}>Save</button>
          <button onClick={deletePerson}>Delete</button>
        </div>
      </>}
    </fieldset>,
    table: <Table personList={personList} onClick={handleTableClick}/>
  };
  return (<div className='App'>
    <fieldset style={{width: '180px', flexShrink: 0, margin: 'auto 0'}}>
      <legend>Menu</legend>
      {panel === 'table' ? (<>
        <button onClick={() => setPanel('add')}>Add person</button>
        <button onClick={() => setPanel('edit')}>Edit person</button>
      </>) : (
        <button onClick={() => setPanel('table')}>Return</button>
      )}
    </fieldset>
    <div style={{margin: 'auto'}}>
      {panels[panel]}
    </div>
  </div>);
}
