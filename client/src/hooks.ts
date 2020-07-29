import React, { useState, useEffect, useCallback } from 'react';
import PhysicalWorld from './world';
import Robot, { RobotType } from './robot';
import { createDefaultRobot } from './robot/utils';
import { Location } from './global-types';

export type Dispatch = React.Dispatch<React.SetStateAction<any>>;


export function useWorld(): [PhysicalWorld, (n: number) => void] {
    const createWorld = (x = 5, y = 5) => new PhysicalWorld(x,y);
    const [world, setWorld] = useState(createWorld());
    const newWorld = (n: number) => setWorld(createWorld(n,n));

    return [world, newWorld];
}


export function buildRobot (world: PhysicalWorld) {
    const [robot, setRobot] = useState(createDefaultRobot(world));
    const collection: Array<RobotType> = [];

    useEffect(() => {
        // @ts-ignore
        robot.renderInUI(robot.location);
    });

    const newRobot = useCallback(
        () => {
            const r = createDefaultRobot(world);

            // @ts-ignore
            collection.push(robot);
            setRobot(r);
            console.log('COLLECTION', collection);
        },
        [robot],
      );

    const moveToLoc = useCallback(
        (loc: Location) => {
            console.log('MOVE robot', robot);
            robot.moveTo(loc);
        },
        [robot],
      );

    return [robot, newRobot, moveToLoc];
}

