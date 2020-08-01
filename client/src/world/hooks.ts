import React, { useState, useEffect } from 'react';
import PhysicalWorld from '../world';
import PubSub, { EventType } from '../pub-sub';
import { Dispatch } from '../global-types';


export function useWorld(): [PhysicalWorld, (n: number) => void] {
    const createWorld = (x = 5, y = 5) => new PhysicalWorld(x,y);
    const [world, setWorld] = useState(createWorld());
    const newWorld = (n: number) => setWorld(createWorld(n,n));

    useEffect(() => {
        PubSub.publish(EventType.NewWorld, world);
    });

    return [world, newWorld];
}
