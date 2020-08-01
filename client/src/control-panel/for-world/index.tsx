import React from "react";
import Wrapper from "../../portal";
import ControlsForWorld, { ControlsProps } from "./for-world";

export const PORTAL_ID = "world-control-panel";

export default function (props: ControlsProps) {
    return (
        <Wrapper portalId={PORTAL_ID}>
            <ControlsForWorld {...props} />
        </Wrapper>
    );
}