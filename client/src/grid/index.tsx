import React, { Component } from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import Row from '../row';
import Col from '../col';
import Tile from '../tile';

interface GridProps {
    xAxis: number,
    yAxis: number
}

const styles = {
    grid: {
        backgroundImage: 'linear-gradient(to right, #6f845b, #badd99)',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-evenly',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
    }
};
type StyledProps = WithStylesProps<typeof styles> & GridProps;


const Grid = injectSheet(styles)(({
    classes,
    xAxis,
    yAxis,
    ...props
}: StyledProps) => (
    <div
        className={classes.grid}
        {...props}
    >
        {[...Array(yAxis).keys()].map(y => {
            return (
                <Row key={y} order={y}>
                    {[...Array(xAxis).keys()].map(x => <Col key={x} order={x}><Tile x={x} y={y} /></Col>)}
                </Row>
            );
        })}
    </div>
));

export default Grid;