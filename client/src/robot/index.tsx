import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import RobotUI from './ui';
import { buildRobot } from '../hooks';
import PhysicalWorld from '../world';
import ControlPanel from '../control-panel/for-robot';


interface RobotProps {
    world: PhysicalWorld;
}

const styles = {
};

export type StyledProps = WithStylesProps<typeof styles> & RobotProps;


const Robot = injectSheet(styles)(({
    classes,
    world,
    ...props
}: StyledProps) => {
    const [robot, newRobot, moveToLoc, resetAll] = buildRobot(world);

    return (
        <React.Fragment>
            <RobotUI id={robot.id} />
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