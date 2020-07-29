import React from 'react';
import { render } from 'react-dom';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import SquareContainer from './square-container';
import Grid from './grid';
import ControlPanel from './control-panel';
import { useWorld, createRobot } from './hooks';

const styles = {
    container: {
        display: 'flex'
    },
    controls: {
        flex: '1',
        padding: '10% 3%'
    },
    grid: {
        flex: '3'
    }
};


const App = injectSheet(styles)(({
    classes
}) => {
    const [world, newWorld] = useWorld();
    // const [robot, moveToLoc] = createRobot(world);

    return (
        <div className={classes.container}>
            <div className={classes.grid}>
                <SquareContainer>
                    <Grid world={world.worldMap} />
                </SquareContainer>
            </div>
            <div className={classes.controls}>
                <ControlPanel
                    maxLoc={world.worldMap.length}
                    newWorld={newWorld}
                    // moveToLoc={moveToLoc}
                />
            </div>
        </div>
    );
});

render(<App />, document.getElementById('root'));

