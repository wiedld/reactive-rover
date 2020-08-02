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

type buildRobotUiFnReturn = [UIoffset];

/* This function is called whenever a new robot is created.
    RobotUI is downstream of the Robot.
*/
export function buildRobotUi (robot: RobotType, init: UIoffset): buildRobotUiFnReturn {
  const [offset, setOffset] = useState(init);0

  // @ts-ignore
  PubSub.subscribe(EventType.NewRobotMade, robot.id, (r: RobotType) => renderInUI(r));
  // @ts-ignore
  PubSub.subscribe(EventType.RemoveRobot, robot.id, (r: RobotType) => removeFromUI(r));
  // @ts-ignore
  PubSub.subscribe(EventType.RobotMove, robot.id, (r: RobotType) => renderInUI(r));
  // @ts-ignore
  PubSub.subscribe(EventType.NewWorldMade, robot.id, (() => {
    return () => removeFromUI(robot);
  })());


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
    setOffset({top, left});
  }

  const removeFromUI = (r: RobotType) => {
    console.log('removeFromUI', r);
    // not needed.
    // because it's already removed from the RobotQueue
    // --> therefore, removed from UI.
  }

  return [offset];
}
