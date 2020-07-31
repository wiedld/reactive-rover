import React, { Component } from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import Row from '../row';
import Col from '../col';
import Tile from '../tile';
import { World } from '../global-types';

interface GridProps {
    world: World;
}

const styles = {
    grid: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-evenly',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '8%'
    }
};
type StyledProps = WithStylesProps<typeof styles> & GridProps;


const Grid = injectSheet(styles)(({
    // @ts-ignore
    children,
    classes,
    world,
    ...props
}: StyledProps) => {
    const xAxis = world[0].length;
    const yAxis = world.length;
    return (
        <div
            className={classes.grid}
            {...props}
        >
            {children}
            {[...Array(yAxis).keys()].map(y => {
                return (
                    <Row key={y} order={y}>
                        {[...Array(xAxis).keys()].map(x => (
                            <Col key={x} order={x}>
                                <Tile location={[x,y]} terrain={world[y][x]} />
                            </Col>)
                        )}
                    </Row>
                );
            })}
        </div>
    );
});

export default Grid;
