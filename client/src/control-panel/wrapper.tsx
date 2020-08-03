import React from "react";
import PortalWrapper from "../portal";
import { AnyProps, AnyComponent } from "./types";

type WrappedComponent = AnyComponent;

export default function (id: string, Comp: WrappedComponent) {
    return (props: AnyProps) => {
        // @ts-ignore
        return  <PortalWrapper portalId={id}><Comp {...props} /></PortalWrapper>;
    };
};
