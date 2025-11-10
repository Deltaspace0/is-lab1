export type Color = 'BLACK' | 'BLUE' | 'YELLOW' | 'ORANGE' | 'WHITE';
export type Country = 'RUSSIA' | 'SPAIN' | 'THAILAND';

export const colorValues: Color[] = ['BLACK', 'BLUE', 'YELLOW', 'ORANGE', 'WHITE'];
export const countryValues: Country[] = ['RUSSIA', 'SPAIN', 'THAILAND'];

export interface Entity {
  id: number;
}

export interface Coordinates extends Entity {
  x: number;
  y: number;
}

export interface Location extends Entity {
  name: string;
  x: number;
  y: number;
}

export interface Person extends Entity {
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

export interface ImportData extends Entity {
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

export interface ColumnInfo {
  name: string;
  label: string;
  sortable: boolean;
}
