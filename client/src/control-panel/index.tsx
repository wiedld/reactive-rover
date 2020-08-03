import Wrapper from "./wrapper";
import Robot, { PORTAL_ID as robotId } from "./panels/for-robot";
import Robots, { PORTAL_ID as robotsId } from "./panels/for-robots";

export const ControlsForRobot = Wrapper(robotId, Robot);
export const ControlsForRobots = Wrapper(robotsId, Robots);

export { default as Stdout } from "./panels/for-stdout";
export { default as ControlsForWorld } from "./panels/for-world";

