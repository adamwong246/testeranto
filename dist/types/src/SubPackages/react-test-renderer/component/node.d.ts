/// <reference types="react" />
import { IImpl, ISpec, IInput } from "./index.js";
declare const _default: <ITestShape extends any, IProps, IState>(testImplementations: IImpl<ITestShape>, testSpecifications: ISpec<ITestShape>, testInput: {
    new (props: IProps | Readonly<IProps>): import("react").Component<IProps, IState, any>;
    new (props: IProps, context: any): import("react").Component<IProps, IState, any>;
    contextType?: import("react").Context<any> | undefined;
}) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
