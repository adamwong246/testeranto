import { ITTestResourceRequest } from "./lib.js";
import { IBaseTest, ITestInterface, ITestSpecification } from "./Types.js";
declare const _default: <ITestShape extends IBaseTest>(input: ITestShape["iinput"], testSpecification: ITestSpecification<ITestShape>, testImplementation: any, testInterface: ITestInterface<ITestShape>, testResourceRequirement?: ITTestResourceRequest) => Promise<void>;
export default _default;
