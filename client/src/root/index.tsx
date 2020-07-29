import React, { Component } from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import Grid from '../grid';

const styles = {
    root: {
        height: 'same-as-width',
        paddingTop: '100%', /* 1:1 Aspect Ratio */
        position: 'relative',
        width: '100%'
    }
};
type StyledProps = WithStylesProps<typeof styles>;


const Root = injectSheet(styles)(({
    classes,
    ...props
}: StyledProps) => (
    <div
        className={classes.root}
        {...props}
    >
    <Grid xAxis={6} yAxis={6} />
    </div>
));

export default Root;