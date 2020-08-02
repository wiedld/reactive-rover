import React, { useState } from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import classNames from 'classnames';
import { styles } from "../styles"

export interface Props {
}

export type StyledProps = WithStylesProps<typeof styles> & Props;

export default injectSheet(styles)(({
    classes,
}: StyledProps) => {
    return (
        <div className={classes.container}>
        </div>
    );
});