import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import { RobotType } from "../logic";
import { buildRobotUi } from "./hooks";
// @ts-ignore
import RobotIcon from '../../../public/wall-e.png';

interface RobotUIProps {
    robot: RobotType
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
    robot,
    worldSize: x,
    ...props
}: StyledProps) => {
    const [{top, left}] = buildRobotUi(robot, { top: 30, left: 44 });

    const maxHeight = `${Math.floor(Math.min(100/(x/4), 100))}px`;
    const style = { top: `${top}px`, left: `${left}px` };

    return (<div id={robot.id} className={classes.wrapper} style={style}>
            <img {...props} className={classes.img} src={RobotIcon} id={robot.id} style={{maxHeight}} />
        </div>
    );
});

export default RobotUI;
