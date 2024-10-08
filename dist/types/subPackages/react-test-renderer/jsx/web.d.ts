import { ITTestShape } from "../../../lib";
import { ITestImpl, ITestSpec, IInput } from "./index";
declare const _default: <ITestShape extends ITTestShape>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput, testInterface2?: (testInput: any) => {
    beforeEach: (CComponent: any, props: any) => Promise<import("react-test-renderer").ReactTestRenderer>;
    andWhen: (renderer: import("react-test-renderer").ReactTestRenderer, whenCB: (any: any) => any) => Promise<import("react-test-renderer").ReactTestRenderer>;
}) => Promise<void>;
export default _default;
