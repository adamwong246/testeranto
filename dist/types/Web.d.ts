import type { IBaseTest, ITestImplementation, ITestSpecification } from "./Types";
import Testeranto from "./lib/core.js";
import { ITTestResourceRequest } from "./lib/index.js";
import { ITestInterface } from "./lib/types";
declare const _default: <ITestShape extends IBaseTest>(input: ITestShape["iinput"], testSpecification: ITestSpecification<ITestShape>, testImplementation: ITestImplementation<ITestShape, object>, testInterface: Partial<ITestInterface<ITestShape>>, testResourceRequirement?: ITTestResourceRequest) => Promise<Testeranto<ITestShape>>;
export default _default;
