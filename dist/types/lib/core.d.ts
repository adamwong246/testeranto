import { IBaseTest, ITestSpecification, ITestImplementation } from "../Types.js";
import { ITestInterface } from "./types.js";
import { ITTestResourceRequest } from "./index.js";
import { ClassBuilder } from "./classBuilder.js";
export default abstract class Testeranto<ITestShape extends IBaseTest> extends ClassBuilder<ITestShape> {
    constructor(input: ITestShape["iinput"], testSpecification: ITestSpecification<ITestShape>, testImplementation: ITestImplementation<ITestShape>, testResourceRequirement: ITTestResourceRequest | undefined, testInterface: Partial<ITestInterface<ITestShape>>);
    abstract receiveTestResourceConfig(partialTestResource: string): any;
}
