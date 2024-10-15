import { IBaseTest, ITestImplementation, ITestInterface, ITestSpecification, IUtils } from "../Types";
import { ILogWriter, ITTestResourceConfiguration, ITTestResourceRequest, ITestJob } from "./index.js";
import { ClassBuilder } from "./classBuilder";
export default abstract class Testeranto<ITestShape extends IBaseTest> extends ClassBuilder<ITestShape> {
    constructor(input: ITestShape['iinput'], testSpecification: ITestSpecification<ITestShape>, testImplementation: ITestImplementation<ITestShape, object>, testResourceRequirement: ITTestResourceRequest | undefined, logWriter: ILogWriter, testInterface: Partial<ITestInterface<ITestShape>>, utils: IUtils);
    abstract receiveTestResourceConfig(t: ITestJob, partialTestResource: ITTestResourceConfiguration): any;
}
