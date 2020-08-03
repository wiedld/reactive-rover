import React from "react";
import ReactDOM from "react-dom";

interface Props {
    portalId: string;
}

export default class extends React.Component<Props> {
    el: Element;

    constructor (props: Props) {
        super(props);
        this.el = document.createElement('div');
      }

    componentDidMount() {
        const root = document.getElementById(this.props.portalId);
        root?.appendChild(this.el);
    }

    componentWillUnmount() {
        const root = document.getElementById(this.props.portalId);
        root?.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el);
    }
    
}