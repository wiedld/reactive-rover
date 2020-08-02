import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { buildTileId } from '../../tile/utils';
import { Location, Direction, Dispatch } from '../../global-types';
import { RobotType } from '../types';
import PubSub, { EventType } from '../../pub-sub';
import { DEFAULT_LOCATION, findOffsetFromLocation } from "../utils";

export const getDefaultOffset = (): UIoffsetType => {
  return findOffsetFromLocation(DEFAULT_LOCATION);
};

export type UiRobotType = RobotType & UIoffsetType;

export interface UIoffsetType {
  offset: {
    top: number;
    left: number;
  }
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

    return function cleanup () {
      PubSub.unsubscribe(EventType.RobotMove, robot.id);
      PubSub.unsubscribe(EventType.RemoveRobot, robot.id);
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
    setOffset({ offset: { top, left }});
  }

  const removeFromUI = (r: RobotType) => {
    // remove from obstacle map
    r.removeFromWorld();
  }

  return [offset];
}
