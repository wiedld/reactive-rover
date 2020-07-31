import React, { useState } from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';

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

interface ControlsProps {
    newWorld: (e: number) => void;
}
type StyledProps = WithStylesProps<typeof styles> & ControlsProps;


export default injectSheet(styles)(({
    classes,
    newWorld
}: StyledProps) => {
    const [size, setSize] = useState(0);

    return (
        <div className={classes.container}>
            <form onSubmit={e => { e.preventDefault(); newWorld(size); }}>
                <label>
                    Size of Grid:
                    <input type="number" name="world size" min={1} onChange={e => setSize(parseInt(e.target.value))} />
                </label>
                <input type="submit" value="Build World" className={classes.button} />
            </form>
        </div>
    );
});

