import PhysicalWorld from "./world";
import { RobotType } from "./robot/logic";

export enum EventType {
    NewWorld = 'new-world',
    NewRobot = "new-robot",
    RemoveRobot = "remove-robot",
    RobotMove = 'robot-move',
    EmptyRobotQueue = "empty-robot-queue"
};

type info = PhysicalWorld | RobotType | null;
type SubFn = (arg: info) => void;
export type RemoveFn = () => void;

export default (function(){
    var topics: { [k: string]: { [id: string]: SubFn } } = {};
    var hOP = topics.hasOwnProperty;
  
    return {
        subscribe: function(topic: EventType, id: string, listener: SubFn): RemoveFn {
            if(!hOP.call(topics, topic))
                topics[topic] = {};
    
            topics[topic][id] = listener;

            console.log('SUB > event=', topic,',  id=', id);
            console.log('...length of subs', Object.keys(topics[topic]));

    
            return () => delete topics[topic][id];
        },

        unsubscribe: function(topic: EventType, id: string) {
            topics[topic] && delete topics[topic][id];
        },

        getSubscribers: function(topic: EventType) {
            return Object.keys(topics[topic]);
        },

        empty: function(topic: EventType) {
            delete topics[topic];
        },

        publish: function(topic: EventType, info: info) {
            console.log('PUB > event=', topic, ",  info=", info);

            if(!hOP.call(topics, topic)) return;
    
            Object.keys(topics[topic]).forEach(id => {
                const subFn = topics[topic][id];
                subFn(info);
            });
        }
    };
  })();
