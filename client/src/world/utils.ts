import { Terrian, World } from '../global-types';

export const createWorld = (x: number, y: number): World => {
    function clearRobotLandingSite () {
        out[0][0] = Terrian.P;
    }

    const options = [Terrian.P, Terrian.P, Terrian.P, Terrian.P, Terrian.M, Terrian.C];
    const getRandIdx = () => Math.floor(Math.random() * options.length);

    const out = Array(y).fill(0).map(_ => Array(x).fill(0).map(_ => options[getRandIdx()]));
    clearRobotLandingSite();
    return out;
};
