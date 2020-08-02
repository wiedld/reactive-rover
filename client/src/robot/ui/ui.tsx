import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import { buildUiRobot, getDefaultOffset } from "./hooks";
import { UiRobotType, RobotType } from "../types";
import { buildTileId } from "../../tile/utils";
// @ts-ignore
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

   const [{ offset }, setOffset] = buildUiRobot(robot, getDefaultOffset());

    if (!deactivated) {
        // @ts-ignore
        if (buildTileId(robot.location) != buildTileId([0,0]) || robot.offset != undefined)
            // @ts-ignore
            setOffset({offset: robot.offset});
        // @ts-ignore
    } else {
        // @ts-ignore
        setOffset({ offset: robot.offset });
    }

    const { left, top } = offset;

    console.log("HERE IN ROBOT UI > final", robot, top, left)

    const maxHeight = `${Math.floor(Math.min(100/(x/4), 100) * window.innerWidth/800) }px`;
    const style = { top: `${top}px`, left: `${left}px` };

    return (<div id={robot.id} className={classes.wrapper} style={style}>
            <img {...props} className={classes.img} src={RobotIcon} id={robot.id} style={{maxHeight}} />
        </div>
    );
});

export default RobotUI;
