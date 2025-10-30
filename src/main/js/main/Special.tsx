import { useState } from 'react';
import EnumInput from '../components/EnumInput.tsx';
import Table from '../components/Table.tsx';
import { colorValues } from '../interfaces.ts';
import type { Color, Person } from '../interfaces.ts';
import { deserializePerson, getPersonStrings } from '../util.ts';

export default function Special() {
  const [sumHeight, setSumHeight] = useState(0);
  const [lessWeight, setLessWeight] = useState(0);
  const [amountLessWeight, setAmountLessWeight] = useState(0);
  const [lessBirthday, setLessBirthday] = useState(new Date('2000-01-01'));
  const [personList, setPersonList] = useState<Person[]>([]);
  const [showOperations, setShowOperations] = useState(true);
  const [hairColorToFind, setHairColorToFind] = useState<Color>('BLACK');
  const [hairColorPercentage, setHairColorPercentage] = useState(0);
  const [eyeColorToFind, setEyeColorToFind] = useState<Color>('BLACK');
  const [eyeColorPercentage, setEyeColorPercentage] = useState(0);
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
    setShowOperations(false);
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
  return (showOperations ? (<fieldset style={{width: '250px'}}>
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
  </fieldset>) : (<Table
    label='Person'
    list={personList}
    setList={setPersonList}
    endpoint='/person/birthdayLess'
    deserialize={deserializePerson}
    requestBody={lessBirthday}
    disablePagination={true}
    getStrings={getPersonStrings}
    onClick={() => {}}
  />));
}
