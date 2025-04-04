import type { IBaseTest } from "../../../Types";
import { IImpl, ISpec, IInput } from "./index.js";
declare const _default: <ITestShape extends IBaseTest, IProps, IState>(testImplementations: IImpl<ITestShape>, testSpecifications: ISpec<ITestShape>, testInput: IInput<IProps, IState>) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
