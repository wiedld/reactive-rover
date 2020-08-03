import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import { styles } from "../../styles"
import { stdoutFeed } from "./hooks";

export interface Props {
}

export type StyledProps = WithStylesProps<typeof styles> & Props;

export default injectSheet(styles)(({
    classes,
}: StyledProps) => {
    const [stdout] = stdoutFeed();
    return (
        <div className={classes.container} style={{boxShadow: 'none'}}>
            <label className={classes.text}>
                {stdout}
            </label>
        </div>
    );
});
