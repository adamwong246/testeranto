import { BaseGiven } from "../BaseGiven";
import { BaseSuite } from "../BaseSuite";
import { BaseThen } from "../BaseThen";
import { BaseWhen } from "../BaseWhen";
import { IPM } from "../types";
import { I, TestStore, TestSelection, O } from "./test";
export declare class MockGiven extends BaseGiven<I> {
    constructor(name: string, features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[]);
    givenThat(): Promise<TestStore>;
    uberCatcher(e: Error): void;
}
export declare class MockWhen extends BaseWhen<I> {
    andWhen(store: TestStore, whenCB: (x: TestSelection) => (store: TestStore) => Promise<TestSelection>, testResource: any, pm: IPM): Promise<TestStore>;
    addArtifact(path: string): void;
}
export declare class MockThen extends BaseThen<I> {
    butThen(store: TestStore, thenCB: (s: TestSelection) => Promise<BaseSuite<any, any>>, testResourceConfiguration: any, pm: IPM, ...args: any[]): Promise<TestSelection>;
}
export declare class MockSuite extends BaseSuite<I, O> {
    constructor(name: string, index: number);
}
