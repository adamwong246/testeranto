import Testeranto from "./lib/core.js";
import { ITTestResourceRequest } from "./lib/index.js";
import type { IBaseTest, ITestImplementation, ITestSpecification } from "./Types.js";
import { ITestInterface, INodeTestInterface } from "./lib/types.js";
export declare class NodeTesteranto<TestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> extends Testeranto<TestShape> {
    constructor(input: TestShape["iinput"], testSpecification: ITestSpecification<TestShape>, testImplementation: ITestImplementation<TestShape>, testResourceRequirement: ITTestResourceRequest, testInterface: Partial<ITestInterface<TestShape>>);
    receiveTestResourceConfig(partialTestResource: string): Promise<{
        features: string[];
        failed: number;
    }>;
}
declare const _default: <ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>(input: ITestShape["iinput"], testSpecification: ITestSpecification<ITestShape>, testImplementation: ITestImplementation<ITestShape, object>, testInterface: Partial<INodeTestInterface<ITestShape>>, testResourceRequirement?: ITTestResourceRequest) => Promise<Testeranto<ITestShape>>;
export default _default;
