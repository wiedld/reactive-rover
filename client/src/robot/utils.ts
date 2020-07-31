import { Direction, Location } from '../global-types';
import World from '../world';
import Robot, { RobotType } from './funcs/index';

type CreateDefaultRobotFun = (w: World, l?: Location, d?: Direction) => RobotType;

// @ts-ignore
export const createDefaultRobot: CreateDefaultRobotFun = (world, loc = [0,0], dir = 'N') => new Robot(world, loc, dir);
