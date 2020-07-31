import React, { useState, useEffect, useCallback } from 'react';
import PhysicalWorld from './world';
import { RobotType } from './robot';
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


type BuildRobotFnReturn = [RobotType, () => void, (loc: Location) => void];

export function buildRobot (world: PhysicalWorld): BuildRobotFnReturn {
    const [robot, setRobot]: [RobotType, Dispatch] = useState(createDefaultRobot(world));

    // @ts-ignore
    const addToPubSub = () => PubSub.subscribe(EventType.NewWorld, (w: PhysicalWorld) => {
        try {
            robot.setWorld(w);
        } catch (_) {
            newRobot();
        }
    });

    useEffect(() => {
        PubSub.empty(EventType.NewWorld);
        addToPubSub();
        robot.renderInUI(robot);
    });

    const newRobot = useCallback(
        () => {
            const r = createDefaultRobot(world);
            setRobot(r);
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

    return [robot, newRobot, moveToLoc];
}

