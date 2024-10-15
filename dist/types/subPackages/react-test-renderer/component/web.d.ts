import { IBaseTest } from "../../../Types";
import { ISpec, IInput } from "./index";
declare const _default: <ITestShape extends IBaseTest, IProps, IState>(testImplementations: any, testSpecifications: ISpec<ITestShape>, testInput: IInput<IReactProps, IReactState>) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
