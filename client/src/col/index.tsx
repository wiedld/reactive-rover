import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';

interface ColProps {
    order: number
}

const styles = {
    col: {
        display: 'flex',
        flex: '1 1 auto'
    }
};
type StyledProps = WithStylesProps<typeof styles> & ColProps;

const Col = injectSheet(styles)(({
    classes,
    order,
    ...props
}: StyledProps) => (
    <div
        className={classes.col}
        style={{ order }}
        {...props}
    />
));

export default Col;
