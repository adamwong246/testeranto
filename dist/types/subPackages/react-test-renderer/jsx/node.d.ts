import { IBaseTest } from "../../../Types";
import { ITestImpl, ITestSpec } from "../jsx-promised";
import { IInput } from "./index";
declare const _default: <ITestShape extends IBaseTest>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput, testInterface2?: {
    beforeEach: (CComponent: any, props: any) => Promise<import("react-test-renderer").ReactTestRenderer>;
    andWhen: (renderer: import("react-test-renderer").ReactTestRenderer, whenCB: (any: any) => any) => Promise<import("react-test-renderer").ReactTestRenderer>;
}) => Promise<void>;
export default _default;
