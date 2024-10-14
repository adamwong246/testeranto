import { IBaseTest, ITestInterface, ITestSpecification } from "../Types";
import puppeteer from "puppeteer-core";
import { ILogWriter, ITTestResourceConfiguration, ITTestResourceRequest, ITestJob } from "./index.js";
import { ClassBuilder } from "./classBuilder";
import { BrowserWindow } from "electron";
export default abstract class Testeranto<ITestShape extends IBaseTest> extends ClassBuilder<ITestShape> {
    constructor(input: ITestShape['iinput'], testSpecification: ITestSpecification<ITestShape>, testImplementation: any, testResourceRequirement: ITTestResourceRequest | undefined, logWriter: ILogWriter, testInterface: Partial<ITestInterface<ITestShape>>, utils: puppeteer.Browser | BrowserWindow);
    abstract receiveTestResourceConfig(t: ITestJob, partialTestResource: ITTestResourceConfiguration): any;
}
