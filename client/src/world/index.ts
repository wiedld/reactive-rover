import { Location, Terrian, World } from '../global-types';

export default class PhysicalWorld {
    // top left corner is (X:0, Y:0)
    // bottom right is (X:4, Y:4)
    static WORLD: World = [
        [Terrian.P, Terrian.P, Terrian.P, Terrian.C, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.C, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.C, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.P, Terrian.P],
        [Terrian.P, Terrian.M, Terrian.P, Terrian.P, Terrian.P]
    ];

    static TERRAIN_TYPES = {
        [Terrian.P]: {
          obstacle: false,
          description: 'plains'
        },
        [Terrian.M]: {
          obstacle: true,
          description: 'mountains'
        },
        [Terrian.C]: {
          obstacle: true,
          description: 'crevasse'
        }
      };

    static getTerrain ([x,y]: Location) {
        return PhysicalWorld.WORLD[y] && PhysicalWorld.WORLD[y][x];
    }

    static isOffWorld ([x,y]: Location) {
        return x < 0 || y < 0 || y >= PhysicalWorld.WORLD.length || x >= PhysicalWorld.WORLD[0].length;
    }

    static isSameLoc (loc1: Location, loc2: Location) {
        return loc1[0] == loc2[0] && loc1[1] == loc2[1];
    }

    _objects: Array<Array<number>>;

    removeLocation ([x,y]: Location) {
        !(PhysicalWorld.isOffWorld([x,y])) && this._objects[y][x]--;
    }

    setLocation ([x,y]: Location) {
        !(PhysicalWorld.isOffWorld([x,y])) && this._objects[y][x]++;
    }

    constructor () {
        this._objects = Array(5).fill(0)
            .map((_) => Array(5).fill(0))
    }

    isObstacle (targetLoc: Location, currLoc: Location) {
        const [x,y] = targetLoc;
        const terrain = PhysicalWorld.getTerrain([x,y]);
        const numOtherObjectsAtLoc = this._objects[y][x] - (PhysicalWorld.isSameLoc(currLoc, [x,y]) ? 1 : 0);

        return PhysicalWorld.TERRAIN_TYPES[terrain].obstacle || 0 != numOtherObjectsAtLoc;
    }
}
