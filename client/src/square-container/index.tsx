import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';

const styles = {
    root: {
        height: 'same-as-width',
        paddingTop: '100%', /* 1:1 Aspect Ratio */
        position: 'relative',
        width: '100%'
    }
};
type StyledProps = WithStylesProps<typeof styles>;

const SquareContainer = injectSheet(styles)(({
    classes,
    ...props
}: StyledProps) => (
    <div
        className={classes.root}
        {...props}
    />
));

export default SquareContainer;