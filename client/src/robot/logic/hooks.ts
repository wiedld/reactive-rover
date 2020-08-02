import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PhysicalWorld from '../../world';
import { RobotType } from '.';
import { createDefaultRobot } from '../utils';
import { Location, Dispatch } from '../../global-types';
import PubSub, { EventType } from '../../pub-sub';


type ActiveRobot = RobotType | null;

type BuildRobotFnReturn = [
    ActiveRobot,                  // robot
    (loc: Location) => void    // moveToLoc()
];

/* This function is called whenever a new world is created.
    Robot downstream of the World.
*/
export function buildRobot (world: PhysicalWorld): BuildRobotFnReturn {
    const robotFactoryId = uuidv4();

    const robotFactory = (world: PhysicalWorld) => {
        console.log("ROBOT FACTORY")
        const r = createDefaultRobot(world);
        setRobot(r);
        PubSub.publish(EventType.NewRobotMade, r);
        addToPubSub(r);
        return r;
    };

    const addToPubSub = (r: RobotType) => {
        // @ts-ignore
        PubSub.subscribe(EventType.NewWorldMade, r.id, (() => (w: PhysicalWorld) => {
            // memory cleanup
            PubSub.publish(EventType.RemoveRobot, r);
        })());
    };

    PubSub.subscribe(EventType.CreateRobot, robotFactoryId, () => {
        robotFactory(world);
    });

    const [robot, setRobot]: [ActiveRobot, Dispatch] = useState(null);

    const moveToLoc = useCallback(
        (loc: Location) => {
            if (robot == null) return;

            const cb = (r: RobotType) => PubSub.publish(EventType.RobotMove, r);
            try {
                // @ts-ignore
                robot.moveTo(loc, false, cb);
            } catch (e) {
                console.log('ERROR: bad move');
                robot && cb(robot);
                // FIXME: post message to console.
            }
        },
        [robot],
      );

    return [robot, moveToLoc];
}

