import '../App.css'
import { useCallback, useEffect, useState } from 'react';
import Table from '../components/Table.tsx';
import PersonInput from '../components/PersonInput.tsx';
import PersonIdInput from '../components/PersonIdInput.tsx';
import { colorValues, countryValues, fieldValues } from '../interfaces.ts';
import type {
  Color,
  Coordinates,
  Country,
  ErrorResponse,
  Field,
  Location,
  Person,
  ValidationError
} from '../interfaces.ts';
import EnumInput from '../components/EnumInput.tsx';

type Panel
  = 'add'
  | 'edit'
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

function getRandomString(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random()*characters.length));
  }
  return result;
}

function getRandomColor(): Color {
  return colorValues[Math.floor(Math.random()*colorValues.length)];
}

function getRandomCountry(): Country {
  return countryValues[Math.floor(Math.random()*countryValues.length)];
}

function getRandomPerson(): Person {
  return {
    id: 0,
    name: getRandomString(),
    coordinates: {
      x: Math.floor(Math.random()*100-50),
      y: Math.floor(Math.random()*100-50)
    },
    eyeColor: getRandomColor(),
    hairColor: getRandomColor(),
    location: {
      name: getRandomString(),
      x: Math.floor(Math.random()*100-50),
      y: Math.floor(Math.random()*100-50)
    },
    height: 160+Math.floor(Math.random()*40),
    birthday: new Date('2000-01-01'),
    weight: 60+Math.floor(Math.random()*40),
    nationality: getRandomCountry()
  };
}

function getCoordinatesStrings(coordinates?: Coordinates): string[] {
  if (coordinates) {
    return [
      coordinates.id?.toString() || '',
      coordinates.x.toString(),
      coordinates.y.toString()
    ];
  }
  return ['ID', 'X', 'Y'];
}

function getLocationStrings(location?: Location): string[] {
  if (location) {
    return [
      location.id?.toString() || '',
      location.name,
      location.x.toString(),
      location.y.toString()
    ];
  }
  return ['ID', 'Name', 'X', 'Y'];
}

function getPersonStrings(person?: Person): string[] {
  const coordToString = ({ x, y }: Coordinates): string => {
    return `(${x}, ${y})`;
  };
  if (person) {
    return [
      person.id.toString(),
      person.name,
      coordToString(person.coordinates),
      person.creationDate?.toLocaleString() || 'undefined',
      person.eyeColor,
      person.hairColor,
      `"${person.location.name}": ${coordToString(person.location)}`,
      person.height.toString(),
      person.birthday.toLocaleDateString(),
      person.weight.toString(),
      person.nationality
    ];
  }
  return [
    'ID',
    'Name',
    'Coordinates',
    'Creation date',
    'Eye color',
    'Hair color',
    'Location',
    'Height',
    'Birthday',
    'Weight',
    'Nationality'
  ];
}

export default function App() {
  const [panel, setPanel] = useState<Panel>('personTable');
  const [actionPanel, setActionPanel] = useState<Panel>('add');
  const [personList, setPersonList] = useState<Person[]>([]);
  const [coordinatesList, setCoordinatesList] = useState<Coordinates[]>([]);
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [editId, setEditId] = useState(0);
  const [editPerson, setEditPerson] = useState<Person>(defaultPerson);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [sortField, setSortField] = useState<Field>('None');
  const [sortOrder, setSortOrder] = useState('asc');
  const deserializePerson = (person: Person): Person => {
    if (person.creationDate) {
      person.creationDate = new Date(person.creationDate);
    }
    person.birthday = new Date(person.birthday);
    return person;
  };
  const fetchPersonList = useCallback(async () => {
    if (sortField === 'None') {
      return fetch('/person').then((x) => x.json());
    }
    return fetch(`/person?sortField=${sortField}&sortOrder=${sortOrder}`)
      .then((x) => x.json());
  }, [sortField, sortOrder]);
  const refreshList = useCallback(async () => {
    const bodies = await Promise.all([
      fetchPersonList(),
      fetch('/coordinates').then((x) => x.json()),
      fetch('/location').then((x) => x.json()),
    ]);
    setPersonList(bodies[0].map(deserializePerson));
    setCoordinatesList(bodies[1]);
    setLocationList(bodies[2]);
  }, [fetchPersonList]);
  useEffect(() => {
    if (panel === 'add' || panel === 'edit') {
      setActionPanel(panel);
    }
  }, [panel]);
  useEffect(() => void refreshList(), [refreshList]);
  useEffect(() => {
    if (editId <= 0) {
      return;
    }
    (async () => {
      const response = await fetch(`/person/${editId}`);
      const body: Person = await response.json();
      if (body.id) {
        setEditPerson(deserializePerson(body));
      } else {
        setEditId(0);
      }
    })();
  }, [editId, personList]);
  useEffect(() => setValidationErrors([]), [editPerson]);
  const deletePerson = async () => {
    await fetch(`/person/${editPerson.id}`, { method: 'DELETE' });
    setPanel('personTable');
    refreshList();
  };
  const processErrors = (response: ErrorResponse) => {
    console.log('Error message from the server:', response.message);
    if (response.errors instanceof Array) {
      setValidationErrors(response.errors);
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
      refreshList();
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
      refreshList();
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
    } else {
      refreshList();
    }
  };
  const handleLocationTableClick = async (i: number) => {
    const response = await fetch(`/location/${locationList[i].id}`);
    const body: Location = await response.json();
    if (body.id) {
      editPerson.location = body;
      setPanel(actionPanel);
    } else {
      refreshList();
    }
  };
  const handleRandomClick = async () => {
    const promises: Promise<Response>[] = [];
    for (let i = 0; i < 12; i++) {
      promises.push(fetch(`/person`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(getRandomPerson())
      }));
    }
    await Promise.all(promises);
    refreshList();
  };
  const personInputElement = <PersonInput
    person={editPerson}
    onCoordinatesClick={() => setPanel('coordinatesTable')}
    onLocationClick={() => setPanel('locationTable')}
    onChange={(person) => setEditPerson({...person})}
    validationErrors={validationErrors}
  />;
  const panels = {
    add: <fieldset style={{width: '250px'}}>
      <legend>Add person</legend>
      {personInputElement}
      <button onClick={addPerson}>Add</button>
    </fieldset>,
    edit: <fieldset style={{width: '250px'}}>
      <legend>Edit person (ID: {editId > 0 ? editId : 'None'})</legend>
      <PersonIdInput onChange={(person) => setEditId(person.id)}/>
      {editId > 0 && <>
        {personInputElement}
        <div className='flex-row'>
          <button onClick={updatePerson}>Save</button>
          <button onClick={deletePerson}>Delete</button>
        </div>
      </>}
    </fieldset>,
    personTable: <>
      <Table
        label='Person'
        list={personList}
        getStrings={getPersonStrings}
        onClick={handlePersonTableClick}
      />
      <div className='flex-row'>
        <EnumInput
          label='Sort by'
          possibleValues={fieldValues}
          value={sortField}
          onChange={(value) => setSortField(value)}
        />
        <EnumInput
          label='Sort order'
          possibleValues={['asc', 'desc']}
          value={sortOrder}
          onChange={(value) => setSortOrder(value)}
        />
      </div>
    </>,
    coordinatesTable: <Table
      label='Coordinates'
      list={coordinatesList}
      getStrings={getCoordinatesStrings}
      onClick={handleCoordinatesTableClick}
    />,
    locationTable: <Table
      label='Location'
      list={locationList}
      getStrings={getLocationStrings}
      onClick={handleLocationTableClick}
    />
  };
  return (<div className='App'>
    <fieldset style={{width: '180px', flexShrink: 0, margin: 'auto 0'}}>
      <legend>Menu</legend>
      {panel === 'personTable' ? (<>
        <button className='big-button' onClick={() => setPanel('add')}>
          Add person
        </button>
        <button className='big-button' onClick={() => setPanel('edit')}>
          Edit person
        </button>
        <button className='big-button' onClick={handleRandomClick}>
          Add random persons
        </button>
      </>) : (
        <button className='big-button' onClick={() => {
          if (panel === 'add' || panel === 'edit') {
            setPanel('personTable');
          } else {
            setPanel(actionPanel);
          }
        }}>
          Return
        </button>
      )}
    </fieldset>
    <div style={{margin: 'auto'}}>
      {panels[panel]}
    </div>
  </div>);
}
