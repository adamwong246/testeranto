/// <reference types="react" />
import { IBaseTest } from "../../../Types";
import { ISpec, IInput } from "./index";
declare const _default: <ITestShape extends IBaseTest, IProps, IState>(testImplementations: any, testSpecifications: ISpec<ITestShape>, testInput: {
    new (props: IProps | Readonly<IProps>): import("react").Component<IProps, IState, any>;
    new (props: IProps, context: any): import("react").Component<IProps, IState, any>;
    contextType?: import("react").Context<any> | undefined;
}) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
