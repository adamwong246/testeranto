import React from "react";
export type IProps = {
    foo: string;
    children: [];
};
export type IState = {
    count: number;
};
export declare class ClassicalComponent extends React.Component<IProps, IState> {
    constructor(props: any);
    render(): JSX.Element;
}
export default ClassicalComponent;
