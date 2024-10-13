import { IBaseTest, ITestImplementation, ITestInterface, ITestSpecification } from "./Types";
import { ITTestResourceRequest } from "./lib";
declare const _default: <ITestShape extends IBaseTest>(input: ITestShape["iinput"], testSpecification: ITestSpecification<ITestShape>, testImplementation: ITestImplementation<ITestShape, object>, testInterface: Partial<ITestInterface<ITestShape>>, testResourceRequirement?: ITTestResourceRequest) => Promise<void>;
export default _default;
