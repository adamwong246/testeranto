import { IBaseTest } from "../../../Types";
import { ITestImpl, ITestSpec } from "../jsx-promised";
import { IInput } from "./index.js";
declare const _default: <ITestShape extends IBaseTest>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput, testInterface2?: {
    butThen: (s: import("./index.js").IStore, thenCB: any, tr: any) => Promise<import("./index.js").ISelection>;
    beforeEach: (CComponent: any, props: any) => Promise<import("react-test-renderer").ReactTestRenderer>;
    andWhen: (renderer: import("react-test-renderer").ReactTestRenderer, whenCB: (any: any) => any) => Promise<import("react-test-renderer").ReactTestRenderer>;
}) => Promise<import("../../../lib/core").default<ITestShape>>;
export default _default;
