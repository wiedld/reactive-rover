import React, { FunctionComponent} from "react";
import ReactDOM from "react-dom";
import { WithStylesProps } from 'react-jss';
import PortalWrapper from "../portal";
import { AnyProps, AnyComponent } from "./types";
import { styles } from "./styles";

type WrappedComponent = AnyComponent;

export default function (id: string, Comp: WrappedComponent) {
    return (props: AnyProps) => {
        // @ts-ignore
        return  <PortalWrapper portalId={id}><Comp {...props} /></PortalWrapper>;
    };
};
