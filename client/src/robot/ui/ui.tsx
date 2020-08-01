import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import { Direction, Location } from '../../global-types';
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
        // float: 'left',
        // display: 'inline'
        // // FIXME: do rotation.
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
    const [offsetTop, offsetLeft] = buildRobotUi(robot, { top: 30, left: 44 });

    const maxHeight = `${Math.floor(Math.min(100/(x/4), 100))}px`;
    const style = { top: `${offsetTop}px`, left: `${offsetLeft}px` };

    console.log('maxHeight', maxHeight)
    return (<div className={classes.wrapper} style={style}>
            <img {...props} className={classes.img} src={RobotIcon} id={robot.id} style={{maxHeight}} />
        </div>
    );
});

export default RobotUI;
