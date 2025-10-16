export type Color = 'BLACK' | 'BLUE' | 'YELLOW' | 'ORANGE' | 'WHITE';
export type Country = 'RUSSIA' | 'SPAIN' | 'THAILAND';

export interface Coordinates {
  x: number;
  y: number;
}

export interface Location {
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

export interface ValidationError {
  defaultMessage: string;
  field: string;
}

export interface ErrorResponse {
  errors: ValidationError[];
  message: string;
}
