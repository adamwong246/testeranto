/// <reference types="react" />
import { ITTestShape } from "../../../Types";
import { IImpl, ISpec, IInput } from "./index";
declare const _default: <ITestShape extends ITTestShape, IReactProps, IReactState>(testImplementations: IImpl<ITestShape, IReactProps, IReactState>, testSpecifications: ISpec<ITestShape>, testInput: {
    new (props: IReactProps | Readonly<IReactProps>): import("react").Component<IReactProps, IReactState, any>;
    new (props: IReactProps, context: any): import("react").Component<IReactProps, IReactState, any>;
    contextType?: import("react").Context<any> | undefined;
}) => Promise<void>;
export default _default;
