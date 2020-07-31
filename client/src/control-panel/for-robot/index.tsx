import React from "react";
import Wrapper from "../../portal";
import ControlsForRobot, { ControlsProps } from "./for-robot";

export const PORTAL_ID = "robot-control-panel";

export default function (props: ControlsProps) {
    return (
        <Wrapper portalId={PORTAL_ID}>
            <ControlsForRobot {...props} />
        </Wrapper>
    );
}
