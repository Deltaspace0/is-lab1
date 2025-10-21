import EnumInput from './EnumInput.tsx';
import type { Color, Country, Person, ValidationError } from '../interfaces.ts';
import LabeledInput from './LabeledInput.tsx';

interface PersonInputProps {
  person: Person;
  onCoordinatesClick: () => void;
  onLocationClick: () => void;
  onChange: (person: Person) => void;
  validationErrors: ValidationError[];
}

const colorValues: Color[] = ['BLACK', 'BLUE', 'YELLOW', 'ORANGE', 'WHITE'];
const countryValues: Country[] = ['RUSSIA', 'SPAIN', 'THAILAND'];

export default function PersonInput(props: PersonInputProps) {
  const { person, onChange, validationErrors } = props;
  const errorRecord: Record<string, string> = {};
  for (const error of validationErrors) {
    errorRecord[error.field] = error.defaultMessage;
  }
  return (<div className='flex-column'>
    <LabeledInput label='Name' validationError={errorRecord['name']}>
      <input
        type='text'
        value={person.name}
        onChange={(e) => {
          person.name = e.target.value;
          onChange(person);
        }}
      />
    </LabeledInput>
    <EnumInput
      label='Eye color'
      possibleValues={colorValues}
      value={person.eyeColor}
      onChange={(value) => {
        person.eyeColor = value;
        onChange(person);
      }}
      validationError={errorRecord['eyeColor']}
    />
    <EnumInput
      label='Hair color'
      possibleValues={colorValues}
      value={person.hairColor}
      onChange={(value) => {
        person.hairColor = value;
        onChange(person);
      }}
      validationError={errorRecord['hairColor']}
    />
    <LabeledInput label='Height' validationError={errorRecord['height']}>
      <input
        type='number'
        value={person.height}
        onChange={(e) => {
          person.height = Number(e.target.value);
          onChange(person);
        }}
      />
    </LabeledInput>
    <LabeledInput label='Birthday' validationError={errorRecord['birthday']}>
      <input
        type='date'
        value={person.birthday.toISOString().split('T')[0]}
        onChange={(e) => {
          person.birthday = new Date(e.target.value);
          onChange(person);
        }}
      />
    </LabeledInput>
    <LabeledInput label='Weight' validationError={errorRecord['weight']}>
      <input
        type='number'
        value={person.weight}
        onChange={(e) => {
          person.weight = Number(e.target.value);
          onChange(person);
        }}
      />
    </LabeledInput>
    <EnumInput
      label='Nationality'
      possibleValues={countryValues}
      value={person.nationality}
      onChange={(value) => {
        person.nationality = value;
        onChange(person);
      }}
      validationError={errorRecord['nationality']}
    />
    <fieldset>
      <legend>Coordinates</legend>
      <div className='flex-row'>
        <LabeledInput label='X' validationError={errorRecord['coordinates.x']}>
          <input
            type='number'
            value={person.coordinates.x}
            onChange={(e) => {
              person.coordinates.x = Number(e.target.value);
              onChange(person);
            }}
          />
        </LabeledInput>
        <LabeledInput label='Y' validationError={errorRecord['coordinates.y']}>
          <input
            type='number'
            value={person.coordinates.y}
            onChange={(e) => {
              person.coordinates.y = Number(e.target.value);
              onChange(person);
            }}
          />
        </LabeledInput>
      </div>
      <div>
        <label>
          <p className='text' style={{marginLeft: 'auto'}}>ID:</p>
          <input
            type='number'
            value={person.coordinates.id || 0}
            readOnly={true}
          />
        </label>
      </div>
      <div className='flex-row'>
        <button
            onClick={props.onCoordinatesClick}
            style={{height: '24px'}}>
          Select
        </button>
        <button
            onClick={() => {
              person.coordinates.id = undefined;
              onChange(person);
            }}
            style={{height: '24px'}}>
          New
        </button>
      </div>
    </fieldset>
    <fieldset>
      <legend>Location</legend>
      <LabeledInput label='Name' validationError={errorRecord['location.name']}>
        <input
          type='text'
          value={person.location.name}
          onChange={(e) => {
            person.location.name = e.target.value;
            onChange(person);
          }}
        />
      </LabeledInput>
      <div className='flex-row'>
        <LabeledInput label='X' validationError={errorRecord['location.x']}>
          <input
            type='number'
            value={person.location.x}
            onChange={(e) => {
              person.location.x = Number(e.target.value);
              onChange(person);
            }}
          />
        </LabeledInput>
        <LabeledInput label='Y' validationError={errorRecord['location.y']}>
          <input
            type='number'
            value={person.location.y}
            onChange={(e) => {
              person.location.y = Number(e.target.value);
              onChange(person);
            }}
          />
        </LabeledInput>
      </div>
      <div>
        <label>
          <p className='text' style={{marginLeft: 'auto'}}>ID:</p>
          <input
            type='number'
            value={person.location.id || 0}
            readOnly={true}
          />
        </label>
      </div>
      <div className='flex-row'>
        <button
            onClick={props.onLocationClick}
            style={{height: '24px'}}>
          Select
        </button>
        <button
            onClick={() => {
              person.location.id = undefined;
              onChange(person);
            }}
            style={{height: '24px'}}>
          New
        </button>
      </div>
    </fieldset>
  </div>);
}
