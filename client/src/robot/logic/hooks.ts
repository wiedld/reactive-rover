import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PhysicalWorld from '../../world';
import { RobotType } from '../types';
import { createDefaultRobot } from '../utils';
import { Location, Dispatch } from '../../global-types';
import PubSub, { EventType } from '../../pub-sub';


type ActiveRobot = RobotType | null;

type BuildRobotFnReturn = [
    ActiveRobot,                  // robot
    (loc: Location) => void       // moveToLoc()
];

/* This function is called whenever a new world is created.
    Robot downstream of the World.
*/
export function buildRobot (world: PhysicalWorld): BuildRobotFnReturn {
    const robotFactoryId = uuidv4();

    const robotFactory = (world: PhysicalWorld) => {
        const r = createDefaultRobot(world);
        return r;
    };

    const [robot, setRobot]: [ActiveRobot, Dispatch] = useState(null);

    useEffect(() => {
        PubSub.subscribe(EventType.CreateRobot, robotFactoryId, () => {
            // save curr location of existing robot (updates state of RobotQueue -> re-render)
            if (robot != null) {
                PubSub.publish(EventType.DeactivateRobot, robot);
                // @ts-ignore
                PubSub.unsubscribe(EventType.RobotMove, robot.id);

                PubSub.publish(EventType.Stdout, "Created Robot");
            }

            // make new robot.
            const r = robotFactory(world);
            PubSub.publish(EventType.NewRobotMade, r);
            setRobot(r);
        });

        PubSub.subscribe(EventType.RemoveRobot, robotFactoryId, () => {
            setRobot(null);
        });

        return function cleanup () {
            PubSub.unsubscribe(EventType.CreateRobot, robotFactoryId);
            PubSub.unsubscribe(EventType.RemoveRobot, robotFactoryId);
        }
    });

    const moveToLoc = useCallback(
        (loc: Location) => {
            if (robot == null) return;

            const cb = (r: RobotType) => PubSub.publish(EventType.RobotMove, r);
            // @ts-ignore
            const status = robot.moveTo(loc, false, cb);
            PubSub.publish(EventType.Stdout, JSON.stringify(status.status));
        },
        [robot],
      );

    return [robot, moveToLoc];
}

