import '../App.css'
import { useCallback, useEffect, useState } from 'react';
import LabeledInput from '../components/LabeledInput.tsx';
import Table from '../components/Table.tsx';
import PersonInput from '../components/PersonInput.tsx';
import PersonIdInput from '../components/PersonIdInput.tsx';
import Special from './Special.tsx';
import type {
  Coordinates,
  ErrorResponse,
  Location,
  Person,
  ImportData,
  ValidationError
} from '../interfaces.ts';
import {
  deserializePerson,
  getRandomPerson,
  getPersonStrings,
  getCoordinatesStrings,
  getLocationStrings,
  getImportStrings
} from '../util.ts';

type Panel
  = 'add'
  | 'edit'
  | 'special'
  | 'history'
  | 'personTable'
  | 'coordinatesTable'
  | 'locationTable';

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
  const [username, setUsername] = useState('');
  const [loggedUsername, setLoggedUsername] = useState('');
  const [panel, setPanel] = useState<Panel>('personTable');
  const [actionPanel, setActionPanel] = useState<Panel>('add');
  const [personList, setPersonList] = useState<Person[]>([]);
  const [coordinatesList, setCoordinatesList] = useState<Coordinates[]>([]);
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [importList, setImportList] = useState<ImportData[]>([]);
  const [editId, setEditId] = useState(0);
  const [editPerson, setEditPerson] = useState<Person>(defaultPerson);
  const [valErrors, setValErrors] = useState<ValidationError[]>([]);
  const [fileStatus, setFileStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [personRerender, setPersonRerender] = useState(false);
  const deserPerson = useCallback((person: Person) => {
    return deserializePerson(person);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personRerender]);
  const refreshPersons = () => setPersonRerender((value) => !value);
  useEffect(() => {
    setUsername(loggedUsername);
  }, [loggedUsername]);
  useEffect(() => {
    (async () => {
      const result = await cookieStore.get('uname');
      if (!result) {
        await loginUser('user');
      } else {
        setLoggedUsername(result.value || '');
      }
    })();
  }, []);
  useEffect(() => {
    if (panel === 'add' || panel === 'edit') {
      setActionPanel(panel);
    }
  }, [panel]);
  useEffect(() => {
    if (editId <= 0) {
      return;
    }
    (async () => {
      const response = await fetch(`/person/${editId}`);
      const body: Person = await response.json();
      if (body.id) {
        setEditPerson(deserPerson(body));
      } else {
        setEditId(0);
      }
    })();
  }, [deserPerson, editId, personList]);
  useEffect(() => setValErrors([]), [editPerson]);
  const deletePerson = async () => {
    await fetch(`/person/${editPerson.id}`, { method: 'DELETE' });
    setPanel('personTable');
  };
  const processErrors = (response: ErrorResponse) => {
    console.log('Error message from the server:', response.message);
    if (response.errors instanceof Array) {
      setValErrors(response.errors);
    }
  };
  const addPerson = async () => {
    const response = await fetch(`/person`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editPerson)
    });
    if (response.ok) {
      setPanel('personTable');
    } else {
      response.json().then(processErrors);
    }
  };
  const updatePerson = async () => {
    const response = await fetch(`/person/${editPerson.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editPerson)
    });
    if (response.ok) {
      setPanel('personTable');
    } else {
      response.json().then(processErrors);
    }
  };
  const handlePersonTableClick = (i: number) => {
    setEditId(personList[i].id);
    setPanel('edit');
  };
  const handleCoordinatesTableClick = async (i: number) => {
    const response = await fetch(`/coordinates/${coordinatesList[i].id}`);
    const body: Coordinates = await response.json();
    if (body.id) {
      editPerson.coordinates = body;
      setPanel(actionPanel);
    }
  };
  const handleLocationTableClick = async (i: number) => {
    const response = await fetch(`/location/${locationList[i].id}`);
    const body: Location = await response.json();
    if (body.id) {
      editPerson.location = body;
      setPanel(actionPanel);
    }
  };
  const loginUser = async (newUsername: string) => {
    await fetch('/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: newUsername
    });
    setLoggedUsername(newUsername);
  };
  const handleRandomClick = async () => {
    const promises: Promise<Response>[] = [];
    const randomPersons: Person[] = [];
    for (let i = 0; i < 12; i++) {
      const person = getRandomPerson();
      randomPersons.push(person);
      promises.push(fetch(`/person`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(person)
      }));
    }
    console.log(JSON.stringify(randomPersons, null, 2));
    await Promise.all(promises);
    refreshPersons();
  };
  const handleDeleteAllClick = async () => {
    await fetch(`/person`, { method: 'DELETE' });
    refreshPersons();
  };
  const handleUploadFile = async () => {
    if (!selectedFile) {
      return;
    }
    setFileStatus('');
    const formData = new FormData();
    formData.append('file', selectedFile);
    const response = await fetch(`/import`, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      const count = await response.json();
      setFileStatus(`Created ${count} objects`);
    } else {
      setFileStatus('There was an error');
    }
    refreshPersons();
  };
  const personInputElement = <PersonInput
    person={editPerson}
    onCoordinatesClick={() => setPanel('coordinatesTable')}
    onLocationClick={() => setPanel('locationTable')}
    onChange={(person) => setEditPerson({...person})}
    validationErrors={valErrors}
  />;
  const panels = {
    add: <fieldset style={{width: '250px'}}>
      <legend>Add person</legend>
      {personInputElement}
      <button onClick={addPerson}>Add</button>
    </fieldset>,
    edit: <fieldset style={{width: '250px'}}>
      <legend>Edit person (ID: {editId > 0 ? editId : 'None'})</legend>
      <PersonIdInput
        initId={editId}
        onChange={(person) => setEditId(person.id)}
      />
      {editId > 0 && <>
        {personInputElement}
        <div className='flex-row'>
          <button onClick={updatePerson}>Save</button>
          <button onClick={deletePerson}>Delete</button>
        </div>
      </>}
    </fieldset>,
    special: <Special/>,
    history: <Table
      label='Import history'
      list={importList}
      setList={setImportList}
      endpoint='/import'
      getStrings={getImportStrings}
      columnsInfo={[
        { name: 'id', label: 'ID', sortable: true },
        { name: 'status', label: 'Status', sortable: true },
        { name: 'username', label: 'Username', sortable: true },
        { name: 'count', label: 'Count', sortable: true }
      ]}
      onClick={() => {}}
    />,
    personTable: <>
      <Table
        label='Person'
        list={personList}
        setList={setPersonList}
        endpoint='/person'
        deserialize={deserPerson}
        optionalParams={`&nameFilter=${nameFilter}`}
        getStrings={getPersonStrings}
        columnsInfo={[
          { name: 'id', label: 'ID', sortable: true },
          { name: 'name', label: 'Name', sortable: true },
          { name: 'coordinates', label: 'Coordinates', sortable: false },
          { name: 'creationDate', label: 'Creation date', sortable: true },
          { name: 'eyeColor', label: 'Eye color', sortable: true },
          { name: 'hairColor', label: 'Hair color', sortable: true },
          { name: 'location', label: 'Location', sortable: false },
          { name: 'height', label: 'Height', sortable: true },
          { name: 'birthday', label: 'Birthday', sortable: true },
          { name: 'weight', label: 'Weight', sortable: true },
          { name: 'nationality', label: 'Nationality', sortable: true }
        ]}
        onClick={handlePersonTableClick}
      />
      <label style={{width: '256px'}}>
        <p className='text'>Name filter:</p>
        <input
          type='text'
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </label>
    </>,
    coordinatesTable: <Table
      label='Coordinates'
      list={coordinatesList}
      setList={setCoordinatesList}
      endpoint='/coordinates'
      getStrings={getCoordinatesStrings}
      columnsInfo={[
        { name: 'id', label: 'ID', sortable: true },
        { name: 'x', label: 'X', sortable: true },
        { name: 'y', label: 'Y', sortable: true }
      ]}
      onClick={handleCoordinatesTableClick}
    />,
    locationTable: <Table
      label='Location'
      list={locationList}
      setList={setLocationList}
      endpoint='/location'
      getStrings={getLocationStrings}
      columnsInfo={[
        { name: 'id', label: 'ID', sortable: true },
        { name: 'name', label: 'Name', sortable: true },
        { name: 'x', label: 'X', sortable: true },
        { name: 'y', label: 'Y', sortable: true }
      ]}
      onClick={handleLocationTableClick}
    />
  };
  return (<div className='App'>
    <fieldset style={{width: '240px', flexShrink: 0, margin: 'auto 0'}}>
      <legend>Menu (User: "{loggedUsername}")</legend>
      {panel === 'personTable' ? (<>
        <LabeledInput label='User'>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                loginUser(username);
                e.preventDefault();
              }
            }}
            style={{width: '100%'}}
          />
          <button onClick={() => loginUser(username)} style={{
            width: '64px',
            height: '24px'
          }}>Login</button>
        </LabeledInput>
        <LabeledInput validationError={fileStatus}>
          <input
            type='file'
            onChange={(e) => {
              if (e.target.files) {
                setSelectedFile(e.target.files[0] || null);
              }
            }}
            style={{width: '100%', margin: 'auto'}}
          />
          <button
              onClick={handleUploadFile}
              disabled={selectedFile === null}
              style={{
                width: '64px',
                height: '24px'
              }}>
            Upload
          </button>
        </LabeledInput>
        <button className='big-button' onClick={() => setPanel('add')}>
          Add person
        </button>
        <button className='big-button' onClick={() => setPanel('edit')}>
          Edit person
        </button>
        <button className='big-button' onClick={() => setPanel('special')}>
          Special operations
        </button>
        <button className='big-button' onClick={() => setPanel('history')}>
          Import history
        </button>
        <button className='big-button' onClick={handleRandomClick}>
          Add random persons
        </button>
        {loggedUsername === 'admin' &&
          <button className='big-button' onClick={handleDeleteAllClick}>
            Delete all objects
          </button>}
      </>) : (<button className='big-button' onClick={() => {
        if (panel === 'coordinatesTable' || panel === 'locationTable') {
          setPanel(actionPanel);
        } else {
          setPanel('personTable');
        }
      }}>
        Return
      </button>)}
    </fieldset>
    <div style={{margin: 'auto'}}>
      {panels[panel]}
    </div>
  </div>);
}
