import { Location, Terrian, World } from '../global-types';
import { createWorld } from './utils';

export default class PhysicalWorld {
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

    static isSameLoc (loc1: Location, loc2: Location) {
        return loc1[0] == loc2[0] && loc1[1] == loc2[1];
    }

    _objects: Array<Array<number>>;
    // top left corner is (X:0, Y:0)
    // bottom right is (X:4, Y:4)
    worldMap: World;

    removeLocation ([x,y]: Location) {
        !(this.isOffWorld([x,y])) && this._objects[y][x]--;
    }

    setLocation ([x,y]: Location) {
        !(this.isOffWorld([x,y])) && this._objects[y][x]++;
    }

    constructor (x: number, y: number) {
        this._objects = Array(y).fill(0)
            .map((_) => Array(x).fill(0));
        this.worldMap = createWorld(x,y);
    }

    getTerrain ([x,y]: Location) {
        return this.worldMap[y] && this.worldMap[y][x];
    }

    isOffWorld ([x,y]: Location) {
        return x < 0 || y < 0 || y >= this.worldMap.length || x >= this.worldMap[0].length;
    }

    isObstacle (targetLoc: Location, currLoc: Location) {
        const [x,y] = targetLoc;
        const terrain = this.getTerrain([x,y]);
        const numOtherObjectsAtLoc = this._objects[y][x] - (PhysicalWorld.isSameLoc(currLoc, [x,y]) ? 1 : 0);

        return PhysicalWorld.TERRAIN_TYPES[terrain].obstacle || 0 != numOtherObjectsAtLoc;
    }
}
