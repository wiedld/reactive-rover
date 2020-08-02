import { Direction, Location } from '../global-types';
import World from '../world';
import { RobotType, UIoffsetType } from "./types";
import Robot from './logic/index';
import { buildTileId } from '../tile/utils';

type CreateDefaultRobotFun = (w: World, l?: Location, d?: Direction) => RobotType;

export const createDefaultRobot: CreateDefaultRobotFun = (
    physicalWorld,
    location = DEFAULT_LOCATION,
    direction = 'N'
    // @ts-ignore
) => new Robot({ physicalWorld, location, direction });

export const DEFAULT_LOCATION: Location = [0,0];

export const findOffsetFromLocation = (loc: Location): UIoffsetType => {
    const newTile = document.getElementById(buildTileId(loc));
    if (!newTile)
        return { top: 30, left: 44 };
    else
        return { top: newTile.offsetTop, left: newTile.offsetLeft };
};
