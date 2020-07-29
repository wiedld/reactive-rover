import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';

interface TileProps {
}

const styles = {
    tile: {
        color: 'red',
        backgroundColor: 'red',
        flex: '1 1 auto'
    }
};
type StyledProps = WithStylesProps<typeof styles> & TileProps;



const Tile = injectSheet(styles)(({
    classes
}: StyledProps) => <div className={classes.tile}/>);

export default Tile;
