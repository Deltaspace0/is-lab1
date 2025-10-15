import './App.css'
import { useEffect, useState } from 'react';
import Table from './components/Table.tsx';

export default function App() {
  const [personList, setPersonList] = useState([]);
  const refreshList = async () => {
    const response = await fetch('/person');
    const body = await response.json();
    setPersonList(body);
  };
  useEffect(() => void refreshList(), []);
  const addPerson = async () => {
    await fetch('/person', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'dmitry',
        coordinates: {
          x: 10,
          y: 20
        },
        eyeColor: 'BLUE',
        hairColor: 'BLACK',
        location: {
          name: 'alpha',
          x: 0,
          y: 0
        },
        height: 180,
        birthday: new Date('2002-03-23').toISOString(),
        weight: 100,
        nationality: 'RUSSIA'
      })
    });
    refreshList();
  };
  return (<div className='App'>
    <div className='flex-column'>
      <button onClick={() => addPerson()}>Add person</button>
      <Table personList={personList} onDelete={refreshList}/>
    </div>
  </div>);
}
