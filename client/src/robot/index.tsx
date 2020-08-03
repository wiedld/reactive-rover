import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import RobotUI from './ui';
import { buildRobot } from './logic/hooks';
import PhysicalWorld from '../world';
import { ControlsForRobot as ControlPanel } from '../control-panel';


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
    world,
}: StyledProps) => {
    const [robot, moveToLoc] = buildRobot(world);

    return (
        <React.Fragment>
            {robot && <RobotUI robot={robot} worldSize={world.worldMap.length} key={robot.id} />}
            <ControlPanel
                disabled={robot == null}
                maxLoc={world.worldMap.length}
                moveToLoc={moveToLoc}
            />
        </React.Fragment>
    );
});

export default Robot;