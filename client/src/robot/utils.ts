import { Direction, Location } from '../global-types';
import World from '../world';
import Robot, { RobotType } from './logic/index';

type CreateDefaultRobotFun = (w: World, l?: Location, d?: Direction) => RobotType;

export const createDefaultRobot: CreateDefaultRobotFun = (
    physicalWorld,
    location = [0,0],
    direction = 'N'
    // @ts-ignore
) => new Robot({ physicalWorld, location, direction });
