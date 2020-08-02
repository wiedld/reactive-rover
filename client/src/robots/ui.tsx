import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import PubSub, { EventType } from "../pub-sub";
import { RobotType } from "../robot/types";
import { buildRobotQueue } from "./hooks";
import PhysicalWorld from "../world";
import RobotUI from "../robot/ui";
import Robot from "../robot";
import ControlRobotQueuePanel from "../control-panel/for-robots";

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
    const [allRobots, activeRobot, resetAll, createRobot] = buildRobotQueue();

    console.log("ALL ROBOTS:", allRobots);
    console.log("PubSub > move", PubSub.getSubscribers(EventType.RobotMove));

    return (
        <React.Fragment>
            {/* Non-Active robots. */}
                {Object.keys(allRobots).map(robotId => {
                    if (robotId !== activeRobot)
                        return (
                            <RobotUI
                                key={robotId}
                                deactivated={true}
                                robot={allRobots[robotId]}
                                worldSize={world.worldMap.length}
                            />);
                    return null;
                })}
            {/* Active robot. */}
            <Robot world={world} />
            <ControlRobotQueuePanel
                // @ts-ignore
                newRobot={createRobot}
                // @ts-ignore
                resetAll={resetAll}
            />
        </React.Fragment>
    );
});

export default RobotQueue;
