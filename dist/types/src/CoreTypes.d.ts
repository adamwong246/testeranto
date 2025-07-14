import { ITTestResourceConfiguration } from "./lib";
import { IPM, ITestCheckCallback } from "./lib/types";
import { GivenSpecification, WhenSpecification, ThenSpecification, TestWhenImplementation, Modify, TestSuiteImplementation, TestGivenImplementation, TestThenImplementation, TestCheckImplementation, TestSuiteShape, TestGivenShape, TestWhenShape, TestThenShape, TestCheckShape, SuiteSpecification } from "./Types";
export type ITestInterface<I extends Ibdd_in_any> = {
    assertThis: (x: I["then"]) => any;
    andWhen: (store: I["istore"], whenCB: I["when"], testResource: ITTestResourceConfiguration, pm: IPM) => Promise<I["istore"]>;
    butThen: (store: I["istore"], thenCB: I["then"], testResource: ITTestResourceConfiguration, pm: IPM) => Promise<I["iselection"]>;
    afterAll: (store: I["istore"], pm: IPM) => any;
    afterEach: (store: I["istore"], key: string, pm: IPM) => Promise<unknown>;
    beforeAll: (input: I["iinput"], testResource: ITTestResourceConfiguration, pm: IPM) => Promise<I["isubject"]>;
    beforeEach: (subject: I["isubject"], initializer: (c?: any) => I["given"], testResource: ITTestResourceConfiguration, initialValues: any, pm: IPM) => Promise<I["istore"]>;
};
export type ITestSpecification<I extends Ibdd_in_any, O extends Ibdd_out_any> = (Suite: SuiteSpecification<I, O>, Given: GivenSpecification<I, O>, When: WhenSpecification<I, O>, Then: ThenSpecification<I, O>, Check: ITestCheckCallback<I, O>) => any[];
export type ITestImplementation<I extends Ibdd_in_any, O extends Ibdd_out_any, modifier = {
    whens: TestWhenImplementation<I, O>;
}> = Modify<{
    suites: TestSuiteImplementation<O>;
    givens: TestGivenImplementation<I, O>;
    whens: TestWhenImplementation<I, O>;
    thens: TestThenImplementation<I, O>;
    checks: TestCheckImplementation<I, O>;
}, modifier>;
export type Ibdd_out<ISuites extends TestSuiteShape = TestSuiteShape, IGivens extends TestGivenShape = TestGivenShape, IWhens extends TestWhenShape = TestWhenShape, IThens extends TestThenShape = TestThenShape, IChecks extends TestCheckShape = TestCheckShape> = {
    suites: ISuites;
    givens: IGivens;
    whens: IWhens;
    thens: IThens;
    checks: IChecks;
};
export type Ibdd_out_any = Ibdd_out<TestSuiteShape, TestGivenShape, TestWhenShape, TestThenShape, TestCheckShape>;
export type Ibdd_in<IInput, // Type of initial test input
ISubject, // Type of object being tested
IStore, // Type for storing test state between steps
ISelection, // Type for selecting state for assertions
IGiven, // Type for Given step functions
IWhen, // Type for When step functions
IThen> = {
    /** Initial input required to start tests */
    iinput: IInput;
    /** The subject being tested (class, function, etc) */
    isubject: ISubject;
    /** Complete test state storage */
    istore: IStore;
    /** Selected portion of state for assertions */
    iselection: ISelection;
    /** Function type for Given steps */
    given: IGiven;
    /** Function type for When steps */
    when: IWhen;
    /** Function type for Then steps */
    then: IThen;
};
export type Ibdd_in_any = Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>;
