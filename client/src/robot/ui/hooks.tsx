import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { buildTileId } from '../../tile/utils';
import { Location, Direction, Dispatch } from '../../global-types';
import { RobotType } from '../logic';
import PubSub, { EventType } from '../../pub-sub';

interface UIoffset {
  top: number;
  left: number;
}

type buildRobotUiFnReturn = [number, number]

/* This function is called whenever a new robot is created.
    RobotUI is downstream of the Robot.
*/
export function buildRobotUi (robot: RobotType, init: UIoffset): buildRobotUiFnReturn {
  const [offsetTop, setTop] = useState(init.top);
  const [offsetLeft, setLeft] = useState(init.left);

  // @ts-ignore
  PubSub.subscribe(EventType.RobotMove, robot.id, (r: RobotType) => renderInUI(r));
  // @ts-ignore
  PubSub.subscribe(EventType.NewWorld, robot.id, (() => {
    return () => renderInUI(robot);
  })());


  const renderInUI = (r: RobotType) => {
    const newTile = r && document.getElementById(buildTileId(r.location));
    if (!newTile) return;

    const { offsetLeft: left, offsetTop: top } = newTile;
    setTop(top);
    setLeft(left);
  }

  const removeFromUI = (r: RobotType) => {
    // FIXME TODO
    console.log('removeFromUI')
  }

  return [offsetTop, offsetLeft];
}
