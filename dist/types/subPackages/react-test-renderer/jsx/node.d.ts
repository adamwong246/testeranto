import { IBaseTest } from "../../../Types";
import type { ITestImpl, ITestSpec } from "../jsx-promised";
import { IInput } from "./index.js";
declare const _default: <ITestShape extends IBaseTest<any, any>>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput, testInterface2?: {
    butThen: (s: import("react-test-renderer").ReactTestRenderer, thenCB: any, tr: any) => Promise<import("react-test-renderer").ReactTestRenderer>;
    beforeEach: (CComponent: any, props: any) => Promise<import("react-test-renderer").ReactTestRenderer>;
    andWhen: (renderer: import("react-test-renderer").ReactTestRenderer, whenCB: (any: any) => any) => Promise<import("react-test-renderer").ReactTestRenderer>;
}) => Promise<import("../../../lib/core.js").default<ITestShape>>;
export default _default;
