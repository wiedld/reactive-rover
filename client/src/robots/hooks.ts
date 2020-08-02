import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dispatch } from './../global-types';
import { UiRobotType, RobotType } from '../robot/types';
import { findOffsetFromLocation } from "../robot/utils";
import PubSub, { EventType } from '../pub-sub';

type Queue = { [id: string]: UiRobotType };
type ActiveRobotId = string;   // robot.id

type buildRobotQueueFnReturn = [
    Queue,
    ActiveRobotId | null,
    () => void,                 // resetAll
    () => void,                 // createRobot()
];

export function buildRobotQueue (): buildRobotQueueFnReturn {
    const queueID = uuidv4();
    const q: Queue = {};
    const [queue, setQueue] = useState(q);
    const [activeRobot, setActiveRobot]: [ActiveRobotId | null, Dispatch] = useState(null);

    useEffect(() => {
        PubSub.subscribe(EventType.NewWorldMade, queueID, () => PubSub.publish(EventType.EmptyRobotQueue, null));

        // @ts-ignore
        PubSub.subscribe(EventType.NewRobotMade, queueID, (r: UiRobotType) => {
            queue[r.id] = r;
            setQueue(queue);
            setActiveRobot(r.id);
        });

        // @ts-ignore
        PubSub.subscribe(EventType.DeactivateRobot, queueID, (r: RobotType) => {
            const readyToRetire = Object.assign(r, { offset: findOffsetFromLocation(r._location) });
            queue[r.id] = readyToRetire;
        });

        // @ts-ignore
        PubSub.subscribe(EventType.RemoveRobot, queueID, (r: UiRobotType) => {
            delete queue[r.id];
            setQueue(queue);
        });

        PubSub.subscribe(EventType.EmptyRobotQueue, queueID, () => {
            Object.keys(queue).forEach(rId => {
                PubSub.publish(EventType.RemoveRobot, queue[rId]);
            });
            setQueue({});
            setActiveRobot(null);
        });

        // @ts-ignore
        PubSub.subscribe(EventType.WindowResize, queueID, () => {
            const update: Queue = {};
            Object.keys(queue).forEach(rId => {
                const robot: RobotType = queue[rId];
                // @ts-ignore
                update[rId] = {...robot, offset: findOffsetFromLocation(robot._location) };
            });
            setQueue(update);
        });
  

        return function cleanup () {
            PubSub.unsubscribe(EventType.NewWorldMade, queueID);
            PubSub.unsubscribe(EventType.NewRobotMade, queueID);
            PubSub.unsubscribe(EventType.DeactivateRobot, queueID);
            PubSub.unsubscribe(EventType.RemoveRobot, queueID);
            PubSub.unsubscribe(EventType.EmptyRobotQueue, queueID);
            PubSub.unsubscribe(EventType.WindowResize, queueID);
        }
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