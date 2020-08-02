import { Location } from '../global-types';

export const buildTileId = ([x,y]: Location) => `tile-${y}-${x}`;