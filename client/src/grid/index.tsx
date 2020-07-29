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
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        justifyContent: 'space-evenly',
        position: 'relative',
        width: '100%'
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
        {[...Array(yAxis).keys()].map(rowKey => {
            return (
                <Row order={rowKey}>
                    {[...Array(xAxis).keys()].map(o => <Col key={o} order={o}><Tile /></Col>)}
                </Row>
            );
        })}
    </div>
));

export default Grid;
