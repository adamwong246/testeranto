import { ITTestResourceRequest } from "./lib/index.js";
import { IBaseTest, ITestImplementation, ITestInterface, ITestSpecification } from "./Types.js";
declare const _default: <ITestShape extends IBaseTest>(input: ITestShape["iinput"], testSpecification: ITestSpecification<ITestShape>, testImplementation: ITestImplementation<ITestShape, object>, testInterface: Partial<ITestInterface<ITestShape>>, testResourceRequirement?: ITTestResourceRequest) => Promise<void>;
export default _default;
