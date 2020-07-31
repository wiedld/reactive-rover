import RobotLogic from './logic';
import MixinUiFun, { MixinUIinterface } from './mixin-ui-func';

const FullyFunctionalRobot = MixinUiFun(RobotLogic);

export type RobotType = typeof FullyFunctionalRobot & RobotLogic & MixinUIinterface;

export default FullyFunctionalRobot;
