import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';

interface RowProps {
    order: number
}

const styles = {
    row: {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-evenly'
    }
};
type StyledProps = WithStylesProps<typeof styles> & RowProps;


const Row = injectSheet(styles)(({
    classes,
    order,
    ...props
}: StyledProps) => (
    <div
        className={classes.row}
        style={{ order }}
        {...props}
    />
));

export default Row;
