import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PubSub, { EventType } from '../../../pub-sub';


export function stdoutFeed (): [string] {
    const id = uuidv4();
    const [stdout, setStdout] = useState("");

    useEffect(() => {
        // @ts-ignore
        PubSub.subscribe(EventType.Stdout, id, (s: string) => setStdout(s));

        return function cleanup () {
            PubSub.unsubscribe(EventType.Stdout, id);
        };
    });

    return [stdout];
}