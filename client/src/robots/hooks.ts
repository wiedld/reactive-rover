import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dispatch } from './../global-types';
import { RobotType } from '../robot/logic';
import PubSub, { EventType } from '../pub-sub';

type Queue = { [id: string]: RobotType };
type ActiveRobot = null | string;   // robot.id

type buildRobotQueueFnReturn = [
    Queue,
    ActiveRobot,
    () => void,                 // resetAll
    () => void,                 // createRobot()
];

export function buildRobotQueue (): buildRobotQueueFnReturn {
    const queueID = uuidv4();
    const q: Queue = {};
    const [queue, setQueue] = useState(q);
    const [activeRobot, setActiveRobot]: [ActiveRobot, Dispatch] = useState(null);

    // @ts-ignore
    PubSub.subscribe(EventType.NewRobotMade, queueID, (r: RobotType) => {
        queue[r.id] = r;
        console.log(`add ${r.id}, queue=`, queue);
        setQueue(queue);
        setActiveRobot(r);
    });

    // @ts-ignore
    PubSub.subscribe(EventType.RemoveRobot, queueID, (r: RobotType) => {
        delete queue[r.id];
        console.log(`removed ${r.id}, queue=`, queue);
        setQueue(queue);
    });

    // @ts-ignore
    PubSub.subscribe(EventType.EmptyRobotQueue, queueID, () => {
        Object.keys(queue).forEach(rId => {
            PubSub.publish(EventType.RemoveRobot, queue[rId]);
        });
    });

    const resetAll = useCallback(
        () => {
            PubSub.publish(EventType.EmptyRobotQueue, null);
        }, []
    );

    const createRobot = useCallback(
        () => {
            PubSub.publish(EventType.CreateRobot, null);
        }, []
    );

    return [queue, activeRobot, resetAll, createRobot];
}