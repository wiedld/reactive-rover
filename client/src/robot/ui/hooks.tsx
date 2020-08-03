import { useState, useEffect } from 'react';
import { buildTileId } from '../../tile/utils';
import { RobotType } from '../types';
import PubSub, { EventType } from '../../pub-sub';
import { DEFAULT_LOCATION, findOffsetFromLocation } from "../utils";

export const getDefaultOffset = (): UIoffsetType => {
  return findOffsetFromLocation(DEFAULT_LOCATION);
};

export interface UiRobotType extends RobotType {
  offset: UIoffsetType;
}

export interface UIoffsetType {
    top: number;
    left: number;
}

type buildUiRobotFnReturn = [UIoffsetType];

/* This function is called whenever a new robot is created.
    RobotUI is downstream of the Robot.
*/
export function buildUiRobot (robot: RobotType, init: UIoffsetType): buildUiRobotFnReturn {
  const [offset, setOffset] = useState(init);

  useEffect(() => {
    // @ts-ignore
    PubSub.subscribe(EventType.RobotMove, robot.id, (r: RobotType) => renderInUI(r));
    // @ts-ignore
    PubSub.subscribe(EventType.RemoveRobot, robot.id, (r: RobotType) => removeFromUI(r));

    PubSub.subscribe(EventType.WindowResize, robot.id, () => {
      if (!robot.hasOwnProperty('offset'))
        setOffset(findOffsetFromLocation(robot.location));
    }); 

    return function cleanup () {
      PubSub.unsubscribe(EventType.RobotMove, robot.id);
      PubSub.unsubscribe(EventType.RemoveRobot, robot.id);
      PubSub.unsubscribe(EventType.WindowResize, robot.id);
    }
  });


  const renderInUI = (r: RobotType) => {
    const newTile = r && document.getElementById(buildTileId(r.location));
    if (!newTile) return;

    newTile.animate([{
      backgroundColor: 'grey',
      backgroundImage: 'none'
    }], {
      duration: 2000,
    });

    const { offsetLeft: left, offsetTop: top } = newTile;
    setOffset({ top, left });
  }

  const removeFromUI = (r: RobotType) => {
    // remove from obstacle map
    r?.removeFromWorld && r.removeFromWorld();
  }

  return [offset];
}
