import type { IBaseTest, ITestImplementation, ITestSpecification } from "./Types";
import Testeranto from "./lib/core.js";
import { ITTestResourceRequest } from "./lib/index.js";
import { IFinalResults, ITestInterface } from "./lib/types";
export declare class WebTesteranto<TestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> extends Testeranto<TestShape> {
    constructor(input: TestShape["iinput"], testSpecification: ITestSpecification<TestShape>, testImplementation: ITestImplementation<TestShape>, testResourceRequirement: ITTestResourceRequest, testInterface: Partial<ITestInterface<TestShape>>);
    receiveTestResourceConfig(partialTestResource: any): Promise<IFinalResults>;
}
declare const _default: <ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(input: ITestShape["iinput"], testSpecification: ITestSpecification<ITestShape>, testImplementation: any, testInterface: IWebTestInterface<ITestShape>, testResourceRequirement?: ITTestResourceRequest) => Promise<Testeranto<ITestShape>>;
export default _default;
