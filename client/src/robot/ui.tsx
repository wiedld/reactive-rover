import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import { Direction, Location } from '../global-types';
// @ts-ignore
import RobotIcon from '../../public/wall-e.png';

interface RobotUIProps {
    id: string;
}

const styles = {
    img: {
        // float: 'left',
        // display: 'inline'
        // // FIXME: do rotation.
        margins: 'auto',
        maxWidth: '50px',
        maxHeight: '50px',
        objectFit: 'contain'
    }
};

export type StyledProps = WithStylesProps<typeof styles> & RobotUIProps;


const RobotUI = injectSheet(styles)(({
    classes,
    id,
    ...props
}: StyledProps) =>
     <img {...props} className={classes.img} src={RobotIcon} id={id} />
);

export default RobotUI;
