import React, { useState, useEffect, useCallback } from 'react';
import PhysicalWorld from './world';
import Robot from './robot';
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
    const collection: Array<Robot> = [];

    useEffect(() => {
        // robot.renderInUI(robot.location);

        return () => {
            let r;
            while (collection.length) {
                r = collection.shift();
                // r && r.removeFromUI();
            }
        };
    });

    const newRobot = useCallback(
        () => {
            const r = createDefaultRobot(world);
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

