import { ITTestResourceConfiguration, ITestArtifactory } from "..";
import { BaseGiven, BaseWhen, BaseThen } from "../abstractBase";
import { BaseSuite } from "../BaseSuite";
import { IPM } from "../types";
import { I, TestStore, TestSelection, O } from "./test";
export declare class MockGiven extends BaseGiven<I> {
    constructor(name: string, features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[]);
    givenThat(subject: I["isubject"], testResourceConfiguration: ITTestResourceConfiguration, artifactory: ITestArtifactory, givenCB: I["given"], initialValues: any, pm: IPM): Promise<TestStore>;
    uberCatcher(e: Error): void;
}
export declare class MockWhen extends BaseWhen<I> {
    andWhen(store: TestStore, whenCB: (x: TestSelection) => Promise<TestStore>, testResource: ITTestResourceConfiguration, pm: IPM): Promise<TestStore>;
}
export declare class MockThen extends BaseThen<I> {
    butThen(store: TestStore, thenCB: (s: TestSelection) => Promise<TestSelection>, testResourceConfiguration: ITTestResourceConfiguration, pm: IPM): Promise<TestSelection>;
}
export declare class MockSuite extends BaseSuite<I, O> {
    constructor(name: string, index: number);
}
