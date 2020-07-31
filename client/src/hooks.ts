import React, { useState, useEffect, useCallback } from 'react';
import PhysicalWorld from './world';
import { RobotType } from './robot';
import { createDefaultRobot } from './robot/utils';
import { Location } from './global-types';

export type Dispatch = React.Dispatch<React.SetStateAction<any>>;


export function useWorld(): [PhysicalWorld, (n: number) => void] {
    const createWorld = (x = 5, y = 5) => new PhysicalWorld(x,y);
    const [world, setWorld] = useState(createWorld());
    const newWorld = (n: number) => setWorld(createWorld(n,n));

    return [world, newWorld];
}


type BuildRobotFnReturn = [RobotType, () => void, (loc: Location) => void];

export function buildRobot (world: PhysicalWorld): BuildRobotFnReturn {
    const [robot, setRobot]: [RobotType, Dispatch] = useState(createDefaultRobot(world));
    const collection: Array<RobotType> = [];

    useEffect(() => {
        robot.renderInUI(robot);
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
            setTimeout(() => {
                robot.renderInUI(robot);
            }, 0);
        },
        [robot],
      );

    return [robot, newRobot, moveToLoc];
}

