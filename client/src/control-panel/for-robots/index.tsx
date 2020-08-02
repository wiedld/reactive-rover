import React from "react";
import Wrapper from "../../portal";
import ControlAllRobots, { ControlsProps } from "./for-robots";

export const PORTAL_ID = "control-all-robots";

export default function (props: ControlsProps) {
    return (
        <Wrapper portalId={PORTAL_ID}>
            <ControlAllRobots {...props} />
        </Wrapper>
    );
}