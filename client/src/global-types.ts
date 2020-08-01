export enum Terrian {P = 'Plains', M = 'Mountains', C = 'Crevasse'};
export type Command = 'L' | 'R' | 'F' | 'B';
export type Direction = 'N' | 'S' | 'E' | 'W';
export type Location = [number,number];
export type World = Array<Array<Terrian>>;

// type of react hook setState
export type Dispatch = React.Dispatch<React.SetStateAction<any>>;

