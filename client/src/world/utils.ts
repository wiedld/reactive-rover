import { Terrian, World } from '../global-types';

// FIXME: create world
export const createWorld = (x: number, y: number): World => {
    return [
        [Terrian.P, Terrian.P, Terrian.P, Terrian.C, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.C, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.C, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.P, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.P, Terrian.P]
    ];
};
