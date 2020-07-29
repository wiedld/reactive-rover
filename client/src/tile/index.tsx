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
    blank: {
        opacity: '0%'
    },
    img: {
        margins: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain'
    },
    tile: {
        backgroundImage: 'linear-gradient(to right, #6f845b, #badd99)',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.29)',
        flex: '1 1 auto',
        padding: '20%'
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
            <img
                className={classNames(classes.img, !img ? classes.blank : '')}
                src={img || Canyon}
            />
        </div>
    );
});

export default Tile;
