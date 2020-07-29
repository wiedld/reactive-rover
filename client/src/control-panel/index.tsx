import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';

interface ControlsProps {
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
    classes
}: StyledProps) => {

    const t = () => {};

    return (
        <div className={classes.container}>
            <form onSubmit={t}>
                <label>
                    Size of Grid:
                    <input type="number" name="world size" />
                </label>
            </form>
            <form onSubmit={t}>
                <label>
                    Move Rover To:
                    <input type="number" name="X axis" placeholder="X axis" />
                    <input type="number" name="Y axis" placeholder="Y axis" />
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