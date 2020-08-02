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
        minWidth: '115px',
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
    inner: {
        width: '100%'
    },
    button: {
        backgroundColor: '#B9D9EB'
    }
};

export interface ControlsProps {
    disabled: boolean;
    maxLoc: number;
    moveToLoc: (l: Location) => void;
}

type StyledProps = WithStylesProps<typeof styles> & ControlsProps;

export default injectSheet(styles)(({
    classes,
    disabled,
    maxLoc,
    moveToLoc,
    ...props
}: StyledProps) => {

    const [x, setX] = useState(1);
    const [y, setY] = useState(1);

    const transformLocToZeroIndexing = ([x,y]: Location): Location => ([x-1,y-1]);

    return (
        <div className={classes.container}>
            <form onSubmit={e => { e.preventDefault(); !!moveToLoc && moveToLoc(transformLocToZeroIndexing([x,y])); }} >
                <label className={classes.inner}>
                    Move Rover To:
                    <input
                        className={classes.inner}
                        type="number"
                        name="X axis"
                        min={1} max={maxLoc}
                        placeholder="X axis"
                        onChange={e => setX(parseInt(e.target.value))} />
                    <input
                        className={classes.inner}
                        type="number"
                        name="Y axis"
                        min={1}
                        max={maxLoc}
                        placeholder="Y axis"
                        onChange={e => setY(parseInt(e.target.value))} />
                </label>
                <input type="submit" value="Move Rover" className={classes.button} disabled={disabled}/>
            </form>
        </div>
    );
});

