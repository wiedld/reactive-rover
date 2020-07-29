import React, { useState, useEffect } from 'react';
import PhysicalWorld from './world';
import Robot from './robot';
import { Location } from './global-types';

export type Dispatch = React.Dispatch<React.SetStateAction<any>>;


export function useWorld(): [PhysicalWorld, (n: number) => void] {
    const createWorld = (x = 5, y = 5) => new PhysicalWorld(x,y);
    const [world, setWorld] = useState(createWorld());
    const newWorld = (n: number) => setWorld(createWorld(n,n));

    return [world, newWorld];
}

export function createRobot(world: PhysicalWorld): [Robot, Dispatch] {
     // @ts-ignore
    const createRobot = (loc = [2,2], dir = 'N') => new Robot(world, loc, dir);
    const [robot, moveToLoc] = useState(createRobot());

    useEffect(() => {
        // @ts-ignore
        function handleUserInput (e) {
            console.log('e', e);
            // FIXME: get from user selection? Any sized world?
            // const loc: Location = [2,2];
            // robot.moveTo(loc);
        }
    });

    return [robot, moveToLoc];
}


