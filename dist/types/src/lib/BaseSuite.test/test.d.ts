import { Ibdd_in, Ibdd_out, ITestSpecification, ITestImplementation, ITestAdapter } from "../../CoreTypes";
import { BaseSuite } from "../BaseSuite";
export type TestStore = {
    name?: string;
    index?: number;
    testStore: boolean;
    testSelection?: boolean;
    error?: Error | undefined;
};
export type TestSelection = {
    testSelection: boolean;
    error?: boolean;
};
export type I = Ibdd_in<typeof BaseSuite, BaseSuite<any, any>, // isubject
TestStore, // istore
TestSelection, // iselection
() => Promise<TestStore>, // given
(x: TestSelection) => (store: TestStore) => Promise<TestSelection>, // when
(s: TestSelection) => Promise<BaseSuite<any, any>>>;
export type O = Ibdd_out<{
    Default: [string];
}, {
    Default: [];
}, {
    TestWhen: [];
    RunSuite: [];
}, {
    TestThen: [];
    FeaturesIncludes: [feature: string];
    StoreValid: [];
    SuiteNameMatches: [string];
    SuiteIndexMatches: [number];
}>;
export declare const specification: ITestSpecification<I, O>;
export declare const implementation: ITestImplementation<I, O>;
export declare const testAdapter: ITestAdapter<I>;
