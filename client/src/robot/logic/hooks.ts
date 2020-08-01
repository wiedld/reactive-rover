import React, { useState, useEffect, useCallback } from 'react';
import PhysicalWorld from '../../world';
import { RobotType } from '.';
import { createDefaultRobot } from '../utils';
import { Location, Dispatch } from '../../global-types';
import PubSub, { EventType } from '../../pub-sub';


type BuildRobotFnReturn = [
    RobotType,                  // robot
    () => void,                 // newRobot()
    (loc: Location) => void,    // moveToLoc()
    () => void                  // resetAll
];

/* This function is called whenever a new world is created.
    Robot downstream of the World.
*/
export function buildRobot (world: PhysicalWorld): BuildRobotFnReturn {
    const robotFactory = (world: PhysicalWorld) => {
        const r = createDefaultRobot(world);
        setRobot(r);
        PubSub.publish(EventType.NewRobot, r);
        addToPubSub(r);
        return r;
    };

    const addToPubSub = (r: RobotType) => {
        // @ts-ignore
        PubSub.subscribe(EventType.NewWorld, r.id, (() => (w: PhysicalWorld) => {
            // FIXME TODO. what to do here?
            // resetAll();
            PubSub.publish(EventType.RemoveRobot, r);
        })());
    };

    const [robot, setRobot]: [RobotType, Dispatch] = useState(robotFactory(world));

    const newRobot = useCallback(
        () => {
            robotFactory(world);
        },
        [world],
      );

    const moveToLoc = useCallback(
        (loc: Location) => {
            const cb = (r: RobotType) => PubSub.publish(EventType.RobotMove, r);
            try {
                robot.moveTo(loc, false, cb);
            } catch (e) {
                console.log('ERROR: bad move');
                cb(robot);
                // FIXME: post message to console.
            }
        },
        [robot],
      );

    const resetAll = useCallback(
        () => {
            PubSub.publish(EventType.EmptyRobotQueue, null);
        }, []
    );

    return [robot, newRobot, moveToLoc, resetAll];
}

