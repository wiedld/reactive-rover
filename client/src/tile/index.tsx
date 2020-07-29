import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';

interface TileProps {
    x: number,
    y: number
}

const styles = {
    tile: {
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 50px 0 rgba(0, 0, 0, 0.29)',
        flex: '1 1 auto',
        padding: '15%'
    }
};
type StyledProps = WithStylesProps<typeof styles> & TileProps;



const Tile = injectSheet(styles)(({
    classes
}: StyledProps) => <div className={classes.tile}/>);

export default Tile;
