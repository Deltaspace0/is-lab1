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
  eyeColor: string;
  hairColor: string;
  location: Location;
  height: number;
  birthday: string;
  weight: number;
  nationality: string;
}
