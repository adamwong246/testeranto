import type { IBaseTest, ICheckKlasser, IGivenKlasser, ISuiteKlasser, ITestImplementation, ITestSpecification, IThenKlasser, IWhenKlasser } from "../Types";
import { BaseBuilder } from "./basebuilder.js";
import { ILogWriter, ITTestResourceRequest } from ".";
export declare abstract class ClassBuilder<ITestShape extends IBaseTest> extends BaseBuilder<ITestShape, any, any, any, any, any> {
    constructor(testImplementation: ITestImplementation<ITestShape, any>, testSpecification: ITestSpecification<ITestShape>, input: ITestShape['iinput'], suiteKlasser: ISuiteKlasser<ITestShape>, givenKlasser: IGivenKlasser<ITestShape>, whenKlasser: IWhenKlasser<ITestShape>, thenKlasser: IThenKlasser<ITestShape>, checkKlasser: ICheckKlasser<ITestShape>, testResourceRequirement: ITTestResourceRequest, logWriter: ILogWriter);
}
