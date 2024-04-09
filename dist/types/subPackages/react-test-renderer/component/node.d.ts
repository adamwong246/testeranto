/// <reference types="react" />
import { ITTestShape } from "../../../Types";
import { IImpl, ISpec, IInput } from "./index";
declare const _default: <ITestShape extends ITTestShape, IProps, IState>(testImplementations: IImpl<ITestShape, IProps, IState>, testSpecifications: ISpec<ITestShape>, testInput: {
    new (props: IProps | Readonly<IProps>): import("react").Component<IProps, IState, any>;
    new (props: IProps, context: any): import("react").Component<IProps, IState, any>;
    contextType?: import("react").Context<any> | undefined;
}) => Promise<void>;
export default _default;
