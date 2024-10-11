import { IBaseTest } from "../../../Types";
import { ITestImpl, ITestSpec, IInput, IStore, ISelection } from "./index";
declare const _default: <ITestShape extends IBaseTest>(testImplementations: ITestImpl<ITestShape>, testSpecifications: ITestSpec<ITestShape>, testInput: IInput, testInterface2?: (z: any) => {
    beforeEach: (x: any, ndx: any, testRsource: any, artificer: any) => Promise<IStore>;
    andWhen: (s: IStore, whenCB: any) => Promise<ISelection>;
}) => Promise<void>;
export default _default;
