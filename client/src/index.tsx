import React from 'react';
import { render } from 'react-dom';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import SquareContainer from './square-container';
import Grid from './grid';
import { ControlsForWorld as ControlPanel } from './control-panel';
import { PORTAL_ID } from './control-panel/for-robot';
import { useWorld } from './hooks';

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
    console.log("RENDER APP")

    return (
        <div className={classes.container}>
            <div className={classes.grid}>
                <SquareContainer>
                    <Grid world={world} />
                </SquareContainer>
            </div>
            <div className={classes.controls}>
                <ControlPanel newWorld={newWorld} />
                <div id={PORTAL_ID} />
            </div>
        </div>
    );
});

render(<App />, document.getElementById('root'));

