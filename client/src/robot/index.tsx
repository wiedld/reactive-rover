import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import RobotUI from './ui';
import { buildRobot } from './logic/hooks';
import PhysicalWorld from '../world';
import ControlPanel from '../control-panel/for-robot';


interface RobotProps {
    world: PhysicalWorld;
}

const styles = {
};

export type StyledProps = WithStylesProps<typeof styles> & RobotProps;

/*
    Control Panel is within the Robot instance.
    As such, the last robot created, is the one under control.
*/
const Robot = injectSheet(styles)(({
    classes,
    world,
    ...props
}: StyledProps) => {
    const [robot, newRobot, moveToLoc, resetAll] = buildRobot(world);

    console.log('robot', robot)

    return (
        <React.Fragment>
            <RobotUI robot={robot} worldSize={world.worldMap.length} />
            <ControlPanel
                maxLoc={world.worldMap.length}
                // @ts-ignore
                newRobot={() => newRobot(robot)}
                // @ts-ignore
                moveToLoc={moveToLoc}
                resetAll={resetAll}
            />
        </React.Fragment>
    );
});

export default Robot;