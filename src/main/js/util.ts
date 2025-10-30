import { colorValues, countryValues } from './interfaces.ts';
import type {
  Color,
  Coordinates,
  Country,
  Location,
  Person
} from './interfaces.ts';

export function getRandomString(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random()*characters.length));
  }
  return result;
}

export function getRandomColor(): Color {
  return colorValues[Math.floor(Math.random()*colorValues.length)];
}

export function getRandomCountry(): Country {
  return countryValues[Math.floor(Math.random()*countryValues.length)];
}

export function getRandomPerson(): Person {
  const startDate = new Date('2000-01-01');
  const endDate = new Date('2008-01-01');
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
    birthday: new Date(+startDate+Math.random()*(+endDate-(+startDate))),
    weight: 60+Math.floor(Math.random()*40),
    nationality: getRandomCountry()
  };
}

export function getCoordinatesStrings(coordinates?: Coordinates): string[] {
  if (coordinates) {
    return [
      coordinates.id?.toString() || '',
      coordinates.x.toString(),
      coordinates.y.toString()
    ];
  }
  return ['ID', 'X', 'Y'];
}

export function getLocationStrings(location?: Location): string[] {
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

export function getPersonStrings(person?: Person): string[] {
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

export function deserializePerson(person: Person): Person {
  if (person.creationDate) {
    person.creationDate = new Date(person.creationDate);
  }
  person.birthday = new Date(person.birthday);
  return person;
}
