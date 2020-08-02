import React, { useState } from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import { Location } from '../../global-types';

const styles = {
    container: {
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.29)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '10%',
        '& form': {
            padding: '20% 5%',
            '& label': {
                padding: '5% 5%',
            },
            '& button': {
                display: 'inline-block',
                width: '100%'
            }
        }
    },
    button: {
        backgroundColor: '#B9D9EB'
    }
};

export interface ControlsProps {
    newRobot: () => void;
    resetAll: () => void;
}

type StyledProps = WithStylesProps<typeof styles> & ControlsProps;

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