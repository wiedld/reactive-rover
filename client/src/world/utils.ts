import { Terrian, World } from '../global-types';

export const createWorld = (x: number, y: number): World => {
    // const options = [Terrian.P, Terrian.P, Terrian.P, Terrian.M, Terrian.C];
    const options = [Terrian.P, Terrian.P, Terrian.P, Terrian.P, Terrian.P];
    const getRandIdx = () => Math.floor(Math.random() * options.length);

    const out = Array(y).fill(0);
    return out.map(_ => Array(x).fill(0).map(_ => options[getRandIdx()]));
};
