import { ITTestResourceConfiguration, ITTestResourceRequest, ITTestShape, ITestArtificer, ITestSpecification } from "./core";
declare const _default: <TestShape extends ITTestShape, IInput, ISubject, IStore, ISelection, WhenShape, IThenShape, IState>(input: IInput, testSpecification: ITestSpecification<TestShape, ISubject, IStore, ISelection, IThenShape>, testImplementation: any, testInterface: {
    actionHandler?: ((b: (...any: any[]) => any) => any) | undefined;
    andWhen: (store: IStore, actioner: any, testResource: ITTestResourceConfiguration) => Promise<ISelection>;
    butThen?: ((store: IStore, callback: any, testResource: ITTestResourceConfiguration) => Promise<ISelection>) | undefined;
    assertioner?: ((t: IThenShape) => any) | undefined;
    afterAll?: ((store: IStore, artificer: ITestArtificer) => any) | undefined;
    afterEach?: ((store: IStore, key: string, artificer: ITestArtificer) => Promise<unknown>) | undefined;
    beforeAll?: ((input: IInput, artificer: ITestArtificer) => Promise<ISubject>) | undefined;
    beforeEach?: ((subject: ISubject, initialValues: any, testResource: ITTestResourceConfiguration, artificer: ITestArtificer) => Promise<IStore>) | undefined;
}, testResourceRequirement?: ITTestResourceRequest) => Promise<void>;
export default _default;
