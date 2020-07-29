import * as React from 'react';
import { render } from 'react-dom';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import SquareContainer from './square-container';
import Grid from './grid';

const styles = {
    container: {
        width: '70%'
    }
};

// FIXME: get from user selection? Any sized world?
const x = 5;
const y = 5;

const App = injectSheet(styles)(({
    classes
}) => {
    return (
        <div className={classes.container}>
            <SquareContainer>
                <Grid xAxis={x} yAxis={y} />
            </SquareContainer>
        </div>
    );
});

render(<App />, document.getElementById('root'));

