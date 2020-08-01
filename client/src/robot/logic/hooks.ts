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
        addToPubSub(r);
        return r;
    };

    const newRobotWithSetState = (oldR: RobotType) => {
        const r = robotFactory(world);
        setRobot(r);
    };

    // @ts-ignore
    const addToPubSub = (r) => PubSub.subscribe(EventType.NewWorld, r.id, (w: PhysicalWorld) => {
        /* Managing state btwn hooks, you either:
            1 - have global reducer (useReducer)
            2 - have a PubSub model.

            But if have PubSub, in which the subscriber is changing state
                --> you cannot have a circular dependency.
            
            Since the logic has multiple robots inhabiting the same world
                --> this is robots sharing the world state.

            Therefore, the world comes first.
            And all robots subsribe to world events.
         */
        PubSub.unsubscribe(EventType.NewWorld, r.id);
        // FIXME: post message to console.
    });

    const [robot, setRobot]: [RobotType, Dispatch] = useState(robotFactory(world));

    const newRobot = useCallback(
        () => {
            newRobotWithSetState(robot);
        },
        [robot],
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
            PubSub.empty(EventType.NewWorld);
        }, []
    );

    return [robot, newRobot, moveToLoc, resetAll];
}

