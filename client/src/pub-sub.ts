import PhysicalWorld from "./world";
import { RobotType, UiRobotType } from "./robot/types";

export enum EventType {
    NewWorldMade = 'new-world',
    CreateRobot = "create-robot",
    NewRobotMade = "new-robot",
    DeactivateRobot = 'deactivate-robot',
    RemoveRobot = "remove-robot",
    RobotMove = 'robot-move',
    EmptyRobotQueue = "empty-robot-queue",
    WindowResize = 'window-resize'
};

type info = PhysicalWorld | RobotType | UiRobotType | null;
type SubFn = (arg: info) => void;
export type RemoveFn = () => void;

export default (function(){
    const topics: { [k: string]: { [id: string]: SubFn } } = {};
    const hOP = topics.hasOwnProperty;
  
    return {
        subscribe: function(topic: EventType, id: string, listener: SubFn): RemoveFn {
            if(!hOP.call(topics, topic))
                topics[topic] = {};
    
            topics[topic][id] = listener;
    
            return () => delete topics[topic][id];
        },

        unsubscribe: function(topic: EventType, id: string) {
            topics[topic] && delete topics[topic][id];
        },

        getSubscribers: function(topic: EventType) {
            return !hOP.call(topics, topic) ? [] : Object.keys(topics[topic]);
        },

        empty: function(topic: EventType) {
            delete topics[topic];
        },

        publish: function(topic: EventType, info: info) {
            if(!hOP.call(topics, topic)) return;
    
            Object.keys(topics[topic]).forEach(id => {
                const subFn = topics[topic][id];
                subFn(info);
            });
        }
    };
  })();
