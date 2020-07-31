import React from 'react';
import ReactDOM from 'react-dom';
import { buildTileId } from '../../tile/utils';
import { Location, Direction } from '../../global-types';
import { RobotType } from './index';
import RobotLogic from './logic';

export interface MixinUIinterface {
  renderInUI: (r: RobotLogic) => void;
  removeFromUI: (r: RobotLogic) => void;
}

type Constructor<T = {}> = new (...args: any[]) => T;

export default function MixinUIFunction<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
      renderInUI (r: RobotLogic, oldLoc: Location) {
        const tile = document.getElementById(buildTileId(r.location));
        // console.log('tile', tile)
        const robotDiv = document.getElementById(r.id);

        const rotation = 360/(r.numericDirection +1)/2;
        // robotDiv?.animate([
        //     { transform: `rotate(${rotation}deg)` },
        //     { animationFillMode: 'backwards' },
        //     // { animationDirection: 'reverse' }
        //     // { transform: 'translateY(-300px)' }
        //   ], { 
        //     // timing options
        //     delay: 200,
        //     duration: 1000
        //   });
        
        tile && robotDiv?.animate([
            { transform: `translate(${tile.offsetLeft - 10}px,${tile.offsetTop + 10}px)` },
            // { top: tile.offsetHeight + tile.offsetTop },
            // { left: tile.offsetLeft },
            // { top: tile.offsetHeight + tile.offsetTop },
            // { left: tile.offsetLeft },
            // { animationFillMode: 'backwards' },
            // { animationDirection: 'reverse' }
            // { transform: 'translateY(-300px)' }
          ], { 
            // timing options
            delay: 200,
            duration: 1000
          });
        
        // robotDiv && tile?.appendChild(robotDiv);
        // console.log('renderInUI', rotation)
    }

    removeFromUI () {
        console.log('removeFromUI')
    }
  }
}
