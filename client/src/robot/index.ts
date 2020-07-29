import RobotLogic from './logic';
import Mixin from './mixin';

export type RobotType = typeof RobotLogic.prototype & typeof Mixin;

export default RobotLogic;
