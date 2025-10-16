import EnumInput from './EnumInput.tsx';
import type { Color, Country, Person } from '../interfaces.ts';

interface PersonInputProps {
  person: Person;
  onChange: (person: Person) => void;
}

const colorValues: Color[] = ['BLACK', 'BLUE', 'YELLOW', 'ORANGE', 'WHITE'];
const countryValues: Country[] = ['RUSSIA', 'SPAIN', 'THAILAND'];

export default function PersonInput({ person, onChange }: PersonInputProps) {
  return (<div className='flex-column'>
    <label>
      <p className='text'>Name:</p>
      <input
        type='text'
        value={person.name}
        onChange={(e) => {
          person.name = e.target.value;
          onChange(person);
      }}/>
    </label>
    <EnumInput
      label='Eye color'
      possibleValues={colorValues}
      value={person.eyeColor}
      onChange={(value) => {
        person.eyeColor = value;
        onChange(person);
      }}
    />
    <EnumInput
      label='Hair color'
      possibleValues={colorValues}
      value={person.hairColor}
      onChange={(value) => {
        person.hairColor = value;
        onChange(person);
      }}
    />
    <label>
      <p className='text'>Height:</p>
      <input
        type='number'
        value={person.height}
        onChange={(e) => {
          person.height = Number(e.target.value);
          onChange(person);
        }}
      />
    </label>
    <label>
      <p className='text'>Birthday:</p>
      <input
        type='date'
        value={person.birthday.toISOString().split('T')[0]}
        onChange={(e) => {
          person.birthday = new Date(e.target.value);
          onChange(person);
        }}
      />
    </label>
    <label>
      <p className='text'>Weight:</p>
      <input
        type='number'
        value={person.weight}
        onChange={(e) => {
          person.weight = Number(e.target.value);
          onChange(person);
        }}
      />
    </label>
    <EnumInput
      label='Nationality'
      possibleValues={countryValues}
      value={person.nationality}
      onChange={(value) => {
        person.nationality = value;
        onChange(person);
      }}
    />
  </div>);
}
