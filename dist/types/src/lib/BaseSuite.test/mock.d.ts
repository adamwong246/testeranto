import { BaseGiven, BaseWhen, BaseThen } from "../abstractBase";
import { BaseSuite } from "../BaseSuite";
import { IPM } from "../types";
import { I, TestStore, TestSelection, O } from "./test";
export declare class MockGiven extends BaseGiven<I> {
    constructor(name: string, features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[]);
    givenThat(): Promise<TestStore>;
    uberCatcher(e: Error): void;
}
export declare class MockWhen extends BaseWhen<I> {
    andWhen(store: TestStore, whenCB: (store: TestStore) => Promise<TestStore>, testResource: any, pm: IPM): Promise<TestStore>;
    addArtifact(name: string, content: string): this;
}
export declare class MockThen extends BaseThen<I> {
    butThen(store: TestStore, thenCB: (selection: TestSelection) => Promise<TestSelection>, testResourceConfiguration: any, pm: any): Promise<TestSelection>;
}
export declare class MockSuite extends BaseSuite<I, O> {
    constructor(name: string, index: number);
}
