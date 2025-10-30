export type Color = 'BLACK' | 'BLUE' | 'YELLOW' | 'ORANGE' | 'WHITE';
export type Country = 'RUSSIA' | 'SPAIN' | 'THAILAND';
export type Field
  = 'None'
  | 'id'
  | 'name'
  | 'creationDate'
  | 'eyeColor'
  | 'hairColor'
  | 'height'
  | 'birthday'
  | 'weight'
  | 'nationality';

export const colorValues: Color[] = ['BLACK', 'BLUE', 'YELLOW', 'ORANGE', 'WHITE'];
export const countryValues: Country[] = ['RUSSIA', 'SPAIN', 'THAILAND'];
export const fieldValues: Field[] = [
  'None',
  'id',
  'name',
  'creationDate',
  'eyeColor',
  'hairColor',
  'height',
  'birthday',
  'weight',
  'nationality'
];

export interface Coordinates {
  id?: number;
  x: number;
  y: number;
}

export interface Location {
  id?: number;
  name: string;
  x: number;
  y: number;
}

export interface Person {
  id: number;
  name: string;
  coordinates: Coordinates;
  creationDate?: Date;
  eyeColor: Color;
  hairColor: Color;
  location: Location;
  height: number;
  birthday: Date;
  weight: number;
  nationality: Country;
}

export interface ImportData {
  id: number;
  status: boolean;
  username: string;
  count?: number;
}

export interface ValidationError {
  defaultMessage: string;
  field: string;
}

export interface ErrorResponse {
  errors: ValidationError[];
  message: string;
}
