import Stdout, { Props as StdoutProps } from "./panels/for-stdout";
import Robots, { Props as RobotsProps } from "./panels/for-robots";
import Robot, { Props as RobotProps } from "./panels/for-robot";

export type AnyProps = StdoutProps | RobotsProps | RobotProps;

export type AnyComponent = typeof Stdout | typeof Robots | typeof Robot;
