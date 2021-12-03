import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import { buildUiRobot, UIoffsetType } from "./hooks";
import { UiRobotType, RobotType } from "../types";
import { findOffsetFromLocation } from "../utils";
import RobotIcon from '../../../public/wall-e.png';

interface RobotUIProps {
    deactivated?: boolean;
    robot: RobotType | UiRobotType;
    worldSize: number;
}

const styles = {
    wrapper: {
        zIndex: 1,
        position: 'absolute'
    },
    img: {
        margins: 'auto',
        maxHeight: '50px',
        objectFit: 'contain',
    }
};

export type StyledProps = WithStylesProps<typeof styles> & RobotUIProps;


const RobotUI = injectSheet(styles)(({
    classes,
    deactivated = false,
    robot,
    worldSize: x,
    ...props
}: StyledProps) => {
    /* react hooks are shared state. but each robot is it's own.
        - so either we conditionally use the hook (feels like an antipattern)
        - or break DRY by making two different components. ActivatedRobotUI vs DeactivatedRobotUI.
    */
   let offsetF: UIoffsetType;
   if (deactivated) {
       // @ts-ignore
        offsetF = robot.offset;
   } else {
        const [offset] = buildUiRobot(robot, findOffsetFromLocation(robot._location));
        offsetF = offset;
   }

    const { left, top } = offsetF;

    const maxHeight = `${Math.floor(Math.min(100/(x/4), 100) * window.innerWidth/800) }px`;
    const style = { top: `${top}px`, left: `${left}px` };

    return (<div id={robot.id} className={classes.wrapper} style={style}>
            <img {...props} className={classes.img} src={RobotIcon} id={robot.id} style={{maxHeight}} />
        </div>
    );
});

export default RobotUI;
