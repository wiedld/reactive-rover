import React from 'react';
import { render } from 'react-dom';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import SquareContainer from './square-container';
import Grid from './grid';
import RobotUI from './robot/ui';
import ControlPanel from './control-panel';
import { useWorld, buildRobot } from './hooks';

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
    const [robot, newRobot, moveToLoc] = buildRobot(world);

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
                    // @ts-ignore
                    newRobot={newRobot}
                    // @ts-ignore
                    moveToLoc={moveToLoc}
                />
            </div>
            <RobotUI />
        </div>
    );
});

render(<App />, document.getElementById('root'));

