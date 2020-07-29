import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import { Terrian } from '../global-types';
// @ts-ignore
import Canyon from '../../public/canyon-1.svg';
// @ts-ignore
import Mountain from '../../public/mountains.svg';


interface TileProps {
    terrain: Terrian
}

const styles = {
    img: {
        position: 'absolute',
        margins: 'auto',
        height: '50px',
        width: '50px'
    },
    tile: {
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 50px 0 rgba(0, 0, 0, 0.29)',
        flex: '1 1 auto',
        padding: '30%'
    }
};
type StyledProps = WithStylesProps<typeof styles> & TileProps;



const Tile = injectSheet(styles)(({
    classes,
    terrain
}: StyledProps) => {
    const img = terrain == Terrian.C
        ? Canyon
        : terrain == Terrian.M
            ? Mountain
            : null;

    return (
        <div className={classes.tile}>
            {img ? <img className={classes.img} src={img} /> : null}
        </div>
    );
});

export default Tile;
