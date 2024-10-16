import Testeranto from "./lib/core.js";
import { ITTestResourceRequest } from "./lib/index.js";
import type { IBaseTest, INodeTestInterface, ITestImplementation, ITestSpecification } from "./Types.js";
declare const _default: <ITestShape extends IBaseTest>(input: ITestShape["iinput"], testSpecification: ITestSpecification<ITestShape>, testImplementation: ITestImplementation<ITestShape, object>, testInterface: Partial<INodeTestInterface<ITestShape>>, testResourceRequirement?: ITTestResourceRequest) => Promise<Testeranto<ITestShape>>;
export default _default;
