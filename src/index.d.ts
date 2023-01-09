import { ITestSpecification, ITTestResource, ITTestResourceRequirement, ITTestShape } from "./types";
export declare const Testeranto: <TestShape extends ITTestShape, Input, Subject, Store, Selection_1, WhenShape, ThenShape, InitialStateShape>(input: Input, testSpecification: ITestSpecification<TestShape>, testImplementation: any, testResource: ITTestResourceRequirement, testInterface: {
    actionHandler?: ((b: (...any: any[]) => any) => any) | undefined;
    afterEach?: ((store: Store, ndx: number, cb: any) => unknown) | undefined;
    andWhen: (store: Store, actioner: any, testResource: ITTestResource) => Promise<Selection_1>;
    assertioner?: ((t: ThenShape) => any) | undefined;
    beforeAll?: ((input: Input) => Promise<Subject>) | undefined;
    beforeEach?: ((subject: Subject, initialValues: any, testResource: ITTestResource) => Promise<Store>) | undefined;
    butThen?: ((store: Store, callback: any, testResource: ITTestResource) => Promise<Selection_1>) | undefined;
}) => {
    new (): {};
};
