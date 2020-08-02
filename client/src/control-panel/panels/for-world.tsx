import React, { useState } from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import { styles } from "../styles"

interface Props {
    newWorld: (e: number) => void;
}

type StyledProps = WithStylesProps<typeof styles> & Props;


export default injectSheet(styles)(({
    classes,
    newWorld
}: StyledProps) => {
    const [size, setSize] = useState(0);

    return (
        <div className={classes.container}>
            <form onSubmit={e => { e.preventDefault(); newWorld(size); }}>
                <label className={classes.inner}>
                    Size of Grid:
                    <input
                        className={classes.inner}
                        type="number"
                        name="world size"
                        min={1} max={25}
                        onChange={e => setSize(parseInt(e.target.value))}
                    />
                </label>
                <input type="submit" value="Build World" className={classes.button} />
            </form>
        </div>
    );
});

