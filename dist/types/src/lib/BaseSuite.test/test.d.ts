import { Ibdd_in, Ibdd_out, ITestSpecification, ITestImplementation, ITestInterface } from "../../CoreTypes";
import { BaseSuite } from "../BaseSuite";
export type TestStore = {
    testStore: boolean;
    testSelection?: boolean;
    error?: Error;
};
export type TestSelection = {
    testSelection: boolean;
    error?: boolean;
};
export type I = Ibdd_in<typeof BaseSuite, BaseSuite<any, any>, // isubject
TestStore, // istore
TestSelection, // iselection
() => Promise<TestStore>, // given
(store: TestStore) => Promise<TestStore>, // when
(store: TestStore) => Promise<TestSelection>>;
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
}>;
export declare const specification: ITestSpecification<I, O>;
export declare const implementation: ITestImplementation<I, O>;
export declare const testInterface: ITestInterface<I>;
