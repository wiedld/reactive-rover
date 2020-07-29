import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import SquareContainer from './square-container';
import Grid from './grid';
import ControlPanel from './control-panel';
import PhysicalWorld from './world';
import { World } from './global-types';

const styles = {
    container: {
        display: 'flex',
    },
    controls: {
        flex: '1',
        paddingTop: '5%',
        paddingRight: '3%'
    },
    grid: {
        flex: '3',
        padding: '5%'
    }
};

const App = injectSheet(styles)(({
    classes
}) => {
    const createWorld = (x = 5, y = 5) => new PhysicalWorld(x,y);
    const [world, setWorld] = useState(createWorld());

    useEffect(() => {
        // @ts-ignore
        function handleUserInput (e) {
            // FIXME: get from user selection? Any sized world?
            const x = 5;
            const y = 5;

            setWorld(createWorld(x,y));
        }
    });

    return (
        <div className={classes.container}>
            <div className={classes.grid}>
                <SquareContainer>
                    <Grid world={world.worldMap} />
                </SquareContainer>
            </div>
            <div className={classes.controls}>
                <ControlPanel />
            </div>
        </div>
    );
});

render(<App />, document.getElementById('root'));

