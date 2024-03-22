import { ITTestResourceConfiguration, ITTestResourceRequest, ITTestShape, ITestArtificer, ITestSpecification } from "./core.js";
declare const _default: <TestShape extends ITTestShape, Input, Subject, Store, Selection_1, WhenShape, ThenShape, InitialStateShape>(input: Input, testSpecification: ITestSpecification<TestShape>, testImplementation: any, testInterface: {
    actionHandler?: ((b: (...any: any[]) => any) => any) | undefined;
    andWhen: (store: Store, actioner: any, testResource: ITTestResourceConfiguration) => Promise<Selection_1>;
    butThen?: ((store: Store, callback: any, testResource: ITTestResourceConfiguration) => Promise<Selection_1>) | undefined;
    assertioner?: ((t: ThenShape) => any) | undefined;
    afterAll?: ((store: Store, artificer: ITestArtificer) => any) | undefined;
    afterEach?: ((store: Store, key: string, artificer: ITestArtificer) => Promise<unknown>) | undefined;
    beforeAll?: ((input: Input, artificer: ITestArtificer) => Promise<Subject>) | undefined;
    beforeEach?: ((subject: Subject, initialValues: any, testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<Store>) | undefined;
}, testResourceRequirement?: ITTestResourceRequest) => Promise<void>;
export default _default;
