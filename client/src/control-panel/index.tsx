import React, { useState } from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import { Dispatch } from '../hooks';

interface ControlsProps {
    maxLoc: number;
    newWorld: (e: number) => void;
    // moveToLoc: Dispatch;
}

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
    but: {
        backgroundColor: '#B9D9EB'
    }
};
type StyledProps = WithStylesProps<typeof styles> & ControlsProps;


const Controls = injectSheet(styles)(({
    classes,
    maxLoc,
    newWorld,
    // moveToLoc
}: StyledProps) => {

    const t = () => {};

    const [size, setSize] = useState(0);
    const [x, setX] = useState(1);
    const [y, setY] = useState(1);

    return (
        <div className={classes.container}>
            <form onSubmit={e => { e.preventDefault(); newWorld(size); }}>
                <label>
                    Size of Grid:
                    <input type="number" name="world size" onChange={e => setSize(parseInt(e.target.value))} />
                </label>
                <input type="submit" value="Build World" className={classes.but} />
            </form>
            <form onSubmit={t}>
                <label>
                    Move Rover To:
                    <input
                        type="number"
                        name="X axis"
                        min="1" max={maxLoc}
                        placeholder="X axis"
                        onChange={e => setX(parseInt(e.target.value))} />
                    <input
                        type="number"
                        name="Y axis"
                        min="1"
                        max={maxLoc}
                        placeholder="Y axis"
                        onChange={e => setY(parseInt(e.target.value))} />
                </label>
                <input type="submit" value="Move Rover" className={classes.but} />
            </form>
            <form>
                <button type="button" onClick={t} className={classes.but}>Add Rover</button>
                <button type="reset" onClick={t} className={classes.but}>Reset</button>
            </form>
        </div>
    );
});

export default Controls;