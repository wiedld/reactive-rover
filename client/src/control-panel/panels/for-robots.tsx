import React, { useState } from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import { styles } from "../styles";

export const PORTAL_ID = "control-all-robots";

export interface Props {
    newRobot: () => void;
    resetAll: () => void;
}

export type StyledProps = WithStylesProps<typeof styles> & Props;

export default injectSheet(styles)(({
    classes,
    newRobot,
    resetAll
}: StyledProps) => {

    return (
        <div className={classes.container}>
            <form>
                <button type="button" onClick={newRobot} className={classes.button}>Add Rover</button>
                <button type="reset" onClick={resetAll} className={classes.button}>Rovers sleepytime</button>
            </form>
        </div>
    );
});
