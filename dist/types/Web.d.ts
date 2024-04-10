import { ITestInterface, ITestSpecification } from "./Types";
import { ITTestResourceRequest, ITTestShape } from "./lib";
declare const _default: <TestShape extends ITTestShape, IInput, ISubject, IStore, ISelection, WhenShape, IThenShape, IState>(input: IInput, testSpecification: ITestSpecification<TestShape, ISubject, IStore, ISelection, IThenShape>, testImplementation: any, testInterface: ITestInterface<IStore, ISelection, ISubject, IThenShape, IInput>, testResourceRequirement?: ITTestResourceRequest) => Promise<void>;
export default _default;
