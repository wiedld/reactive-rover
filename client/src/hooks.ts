import React, { useState, useEffect, useCallback } from 'react';
import PhysicalWorld from './world';
import { RobotType } from './robot/funcs';
import { createDefaultRobot } from './robot/utils';
import { Location } from './global-types';
import PubSub, { EventType } from './pub-sub';

export type Dispatch = React.Dispatch<React.SetStateAction<any>>;


export function useWorld(): [PhysicalWorld, (n: number) => void] {
    const createWorld = (x = 5, y = 5) => new PhysicalWorld(x,y);
    const [world, setWorld] = useState(createWorld());
    const newWorld = (n: number) => setWorld(createWorld(n,n));

    useEffect(() => {
        PubSub.publish(EventType.NewWorld, world);
    });

    return [world, newWorld];
}


type BuildRobotFnReturn = [RobotType, () => void, (loc: Location) => void, () => void];

/* This function is called whenever a new world is created.
*/
export function buildRobot (world: PhysicalWorld): BuildRobotFnReturn {
    const robotFactory = (world: PhysicalWorld) => {
        console.log('robotFactory')
        const r = createDefaultRobot(world);
        addToPubSub(r);
        return r;
    };

    const newRobotWithPubSub = (oldR: RobotType) => {
        PubSub.unsubscribe(EventType.NewWorld, robot.id);
        const r = robotFactory(world);
        setRobot(r);
    };

    // @ts-ignore
    const addToPubSub = (r) => PubSub.subscribe(EventType.NewWorld, r.id, (w: PhysicalWorld) => {
        try {
            console.log(r.location, '<', w.worldMap.length);
            r.setWorld(w);
            console.log("...ok")
        } catch (_) {
            console.log('CATCH')
            PubSub.unsubscribe(EventType.NewWorld, r.id);
            // FIXME: post message to console.
        }
    });

    const [robot, setRobot]: [RobotType, Dispatch] = useState(robotFactory(world));

    useEffect(() => {
        robot.renderInUI(robot);
    });

    const newRobot = useCallback(
        () => {
            newRobotWithPubSub(robot);
        },
        [robot],
      );

    const moveToLoc = useCallback(
        (loc: Location) => {
            robot.moveTo(loc);
            setTimeout(() => robot.renderInUI(robot), 0);
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

