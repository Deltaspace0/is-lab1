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
  | 'special'
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
  const [sortField, setSortField] = useState<Field>('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [nameFilter, setNameFilter] = useState('');
  const [sumHeight, setSumHeight] = useState(0);
  const [lessWeight, setLessWeight] = useState(0);
  const [amountLessWeight, setAmountLessWeight] = useState(0);
  const [lessBirthday, setLessBirthday] = useState(new Date('2000-01-01'));
  const [hairColorToFind, setHairColorToFind] = useState<Color>('BLACK');
  const [hairColorPercentage, setHairColorPercentage] = useState(0);
  const [eyeColorToFind, setEyeColorToFind] = useState<Color>('BLACK');
  const [eyeColorPercentage, setEyeColorPercentage] = useState(0);
  const [personRerender, setPersonRerender] = useState(false);
  const deserializePerson = useCallback((person: Person): Person => {
    if (person.creationDate) {
      person.creationDate = new Date(person.creationDate);
    }
    person.birthday = new Date(person.birthday);
    return person;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personRerender]);
  const fetchPersons = () => setPersonRerender((value) => !value);
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
        setEditPerson(deserializePerson(body));
      } else {
        setEditId(0);
      }
    })();
  }, [deserializePerson, editId, personList]);
  useEffect(() => setValidationErrors([]), [editPerson]);
  const deletePerson = async () => {
    await fetch(`/person/${editPerson.id}`, { method: 'DELETE' });
    setPanel('personTable');
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
    fetchPersons();
  };
  const handleSumHeightClick = async () => {
    const response = await fetch('/person/sumHeight');
    const body = await response.json();
    setSumHeight(body);
  };
  const handleWeightAmountClick = async () => {
    const response = await fetch(`/person/weightLess?weight=${lessWeight}`);
    const body = await response.json();
    setAmountLessWeight(body);
  };
  const handleBirthdayClick = async () => {
    const response = await fetch(`/person/birthdayLess`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lessBirthday)
    });
    const body = await response.json();
    setPersonList(body.map(deserializePerson));
    setPanel('personTable');
  };
  const handleHairClick = async () => {
    const response = await fetch(`/person/hairColorPercentage?`+
      `hairColor=${hairColorToFind}`);
    const body = await response.json();
    setHairColorPercentage(body);
  };
  const handleEyeClick = async () => {
    const response = await fetch(`/person/eyeColorPercentage?`+
      `eyeColor=${eyeColorToFind}`);
    const body = await response.json();
    setEyeColorPercentage(body);
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
    special: <fieldset style={{width: '250px'}}>
      <legend>Operations</legend>
      <div className='flex-row'>
        <button onClick={handleSumHeightClick}>Height sum</button>
        <p className='text'>{sumHeight}</p>
      </div>
      <div className='flex-row'>
        <input
          type='number'
          value={lessWeight}
          onChange={(e) => setLessWeight(Number(e.target.value))}
          style={{width: '64px'}}
        />
        <button onClick={handleWeightAmountClick}>Amount "less weight"</button>
        <p className='text'>{amountLessWeight}</p>
      </div>
      <div className='flex-row'>
        <input
          type='date'
          value={lessBirthday.toISOString().split('T')[0]}
          onChange={(e) => setLessBirthday(new Date(e.target.value))}
        />
        <button onClick={handleBirthdayClick}>Less birthday</button>
      </div>
      <div className='flex-row'>
        <EnumInput
          label='Hair color'
          possibleValues={colorValues}
          value={hairColorToFind}
          onChange={(value) => setHairColorToFind(value)}
        />
        <button onClick={handleHairClick} style={{width: '32px'}}>Find</button>
        <p className='text'>{Math.floor(hairColorPercentage*100)/100}%</p>
      </div>
      <div className='flex-row'>
        <EnumInput
          label='Eye color'
          possibleValues={colorValues}
          value={eyeColorToFind}
          onChange={(value) => setEyeColorToFind(value)}
        />
        <button onClick={handleEyeClick} style={{width: '32px'}}>Find</button>
        <p className='text'>{Math.floor(eyeColorPercentage*100)/100}%</p>
      </div>
    </fieldset>,
    personTable: <>
      <Table
        label='Person'
        list={personList}
        setList={setPersonList}
        endpoint='/person'
        deserialize={deserializePerson}
        optionalParams={sortField === 'None'
          ? `&nameFilter=${nameFilter}`
          : `&sortField=${sortField}&sortOrder=${sortOrder}`+
            `&nameFilter=${nameFilter}`
        }
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
        <label>
          <p className='text'>Name filter:</p>
          <input
            type='text'
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </label>
      </div>
    </>,
    coordinatesTable: <Table
      label='Coordinates'
      list={coordinatesList}
      setList={setCoordinatesList}
      endpoint='/coordinates'
      getStrings={getCoordinatesStrings}
      onClick={handleCoordinatesTableClick}
    />,
    locationTable: <Table
      label='Location'
      list={locationList}
      setList={setLocationList}
      endpoint='/location'
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
        <button className='big-button' onClick={() => setPanel('special')}>
          Special operations
        </button>
        <button className='big-button' onClick={handleRandomClick}>
          Add random persons
        </button>
      </>) : (<button className='big-button' onClick={() => {
        if (panel === 'add' || panel === 'edit' || panel === 'special') {
          setPanel('personTable');
        } else {
          setPanel(actionPanel);
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
