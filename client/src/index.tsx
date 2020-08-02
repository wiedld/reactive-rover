import React from 'react';
import { render } from 'react-dom';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import SquareContainer from './square-container';
import Grid from './grid';
import { ControlsForWorld as ControlPanel } from './control-panel';
import { PORTAL_ID as robotControls } from './control-panel/panels/for-robot';
import { PORTAL_ID as allRobotsControls } from './control-panel/panels/for-robots';
import { useWorld } from './world/hooks';

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

    return (
        <div className={classes.container}>
            <div className={classes.grid}>
                <SquareContainer>
                    <Grid world={world} />
                </SquareContainer>
            </div>
            <div className={classes.controls}>
                <ControlPanel newWorld={newWorld} />
                <div id={robotControls} />
                <div id={allRobotsControls} />
            </div>
        </div>
    );
});

render(<App />, document.getElementById('root'));

