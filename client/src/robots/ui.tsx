import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import PubSub, { EventType } from "../pub-sub";
import { RobotType } from "../robot/logic";
import { buildRobotQueue } from "./hooks";
import PhysicalWorld from "../world";
import RobotUI from "../robot/ui";
import Robot from "../robot";

interface RobotQueue {
    world: PhysicalWorld;
}

const styles = {
};

export type StyledProps = WithStylesProps<typeof styles> & RobotQueue;


const RobotQueue = injectSheet(styles)(({
    world,
    ...props
}: StyledProps) => {
    const [allRobots, activeRobot] = buildRobotQueue();

    console.log("ALL ROBOTS:", allRobots);
    return (
        <React.Fragment>
            {Object.keys(allRobots).map(robotId => {
                {/* Non-Active robots. */}
                if (robotId !== activeRobot)
                    return (
                        <RobotUI 
                            robot={allRobots[robotId]}
                            worldSize={world.worldMap.length}
                        />);
                {/* Active robot. */}
                return (<Robot world={world} />);
            })}
        </React.Fragment>
    );
});

export default RobotQueue;
