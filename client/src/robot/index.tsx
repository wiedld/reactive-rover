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
    const [robot, moveToLoc] = buildRobot(world);

    return (
        <React.Fragment>
            {robot && <RobotUI robot={robot} worldSize={world.worldMap.length} key={robot.id} />}
            <ControlPanel
                disabled={robot == null}
                maxLoc={world.worldMap.length}
                // @ts-ignore
                moveToLoc={moveToLoc}
            />
        </React.Fragment>
    );
});

export default Robot;