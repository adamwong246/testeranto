import { Ibdd_in, Ibdd_out } from "../../../Types.js";
import type { ITestImpl, ITestSpec } from "../jsx-promised";
import { IInput } from "./index.js";
declare const _default: <I extends Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, O extends Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(testImplementations: ITestImpl<I, O>, testSpecifications: ITestSpec<I, O>, testInput: IInput, testInterface2?: {
    butThen: (s: import("./index.js").IStore, thenCB: any) => Promise<import("./index.js").ISelection>;
    beforeEach: (CComponent: any, props: any) => Promise<import("react-test-renderer").ReactTestRenderer>;
    andWhen: (renderer: import("react-test-renderer").ReactTestRenderer, whenCB: (any: any) => any) => Promise<import("react-test-renderer").ReactTestRenderer>;
}) => Promise<import("../../../lib/core.js").default<I, O>>;
export default _default;
