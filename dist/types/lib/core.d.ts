import { IBaseTest, ITestSpecification, ITestImplementation } from "../Types.js";
import { ITestInterface, IUtils } from "./types.js";
import { ILogWriter, ITTestResourceConfiguration, ITTestResourceRequest, ITestJob } from "./index.js";
import { ClassBuilder } from "./classBuilder.js";
export default abstract class Testeranto<ITestShape extends IBaseTest> extends ClassBuilder<ITestShape> {
    constructor(input: ITestShape["iinput"], testSpecification: ITestSpecification<ITestShape>, testImplementation: ITestImplementation<ITestShape>, testResourceRequirement: ITTestResourceRequest | undefined, logWriter: ILogWriter, testInterface: Partial<ITestInterface<ITestShape>>);
    abstract receiveTestResourceConfig(t: ITestJob, partialTestResource: ITTestResourceConfiguration, utils: IUtils): any;
}
