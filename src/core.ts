import { ITestSpecification } from "./Types";
import {
  BaseWhen,
  BaseThen,
  BaseCheck,
  BaseSuite,
  BaseGiven,
  ClassBuilder
} from "./base.js";
import {
  ILogWriter,
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITTestShape,
  ITestArtificer,
  ITestJob,
  defaultTestResourceRequirement
} from "./lib.js";

export default abstract class Testeranto<
  TestShape extends ITTestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  IInput,
  IGivenShape
> extends ClassBuilder<
  TestShape,
  IState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  IInput,
  IGivenShape
> {
  constructor(
    input: IInput,
    testSpecification: ITestSpecification<
      TestShape,
      ISubject,
      IStore,
      ISelection,
      IThenShape,
      IGivenShape
    >,
    testImplementation,
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    logWriter: ILogWriter,

    beforeAll: (
      input: IInput,
      artificer: ITestArtificer,
      testResource: ITTestResourceConfiguration
    ) => Promise<ISubject>,
    beforeEach: (
      subject: ISubject,
      initializer,
      testResource: ITTestResourceConfiguration,
      artificer: ITestArtificer,
      initialValues
    ) => Promise<IStore>,
    afterEach: (
      store: IStore,
      key: string,
      artificer: ITestArtificer
    ) => Promise<unknown>,
    afterAll: (
      store: IStore,
      artificer: ITestArtificer
    ) => any,
    butThen: (
      s: IStore,
      thenCB: (storeState: ISelection) => IThenShape,
      testResource: ITTestResourceConfiguration,
    ) => any,
    andWhen: (
      store: IStore,
      whenCB,
      testResource: ITTestResourceConfiguration
    ) => Promise<ISelection>,
  ) {
    super(
      testImplementation,
      testSpecification,
      input,

      class extends BaseSuite<
        IInput,
        ISubject,
        IStore,
        ISelection,
        IThenShape,
        TestShape,
        IGivenShape
      > {

        async setup(s: IInput, artifactory): Promise<ISubject> {
          return (beforeAll || (async (
            input: IInput,
            artificer: ITestArtificer,
          ) => input as any))(
            s,
            artifactory,
            this.testResourceConfiguration
          );
        }
      } as any,

      class Given extends BaseGiven<ISubject, IStore, ISelection, IThenShape, IGivenShape> {

        async givenThat(subject, testResource, artifactory, initializer) {
          return beforeEach(
            subject,
            initializer,
            testResource,
            (fPath: string, value: unknown) =>
              // TODO does not work?
              artifactory(`beforeEach/${fPath}`, value),
            this.initialValues
          );
        }

        afterEach(
          store: IStore,
          key: string,
          artifactory
        ): Promise<unknown> {
          return new Promise((res) =>
            res(afterEach(store, key, (fPath: string, value: unknown) =>
              artifactory(`after/${fPath}`, value)))
          );
        }
        afterAll(store, artifactory) {
          return afterAll(store, (fPath: string, value: unknown) =>
            // TODO does not work?
            artifactory(`afterAll4-${this.name}/${fPath}`, value));
        }
      } as any,

      class When extends BaseWhen<IStore, ISelection, IWhenShape> {
        async andWhen(store, whenCB, testResource) {
          return await andWhen(store, whenCB, testResource);
        }
      } as any,

      class Then extends BaseThen<ISelection, IStore, IThenShape> {

        async butThen(
          store: any,
          testResourceConfiguration?: any
        ): Promise<ISelection> {
          const newState = await butThen(store, this.thenCB, testResourceConfiguration);
          return newState;
        }
      } as any,

      class Check extends BaseCheck<
        ISubject,
        IStore,
        ISelection,
        IThenShape,
        TestShape
      > {
        initialValues: any;

        constructor(
          name: string,
          features: string[],
          checkCallback: (a, b) => any,
          whens,
          thens,
          initialValues: any
        ) {
          super(name, features, checkCallback, whens, thens);
          this.initialValues = initialValues;
        }

        async checkThat(subject, testResourceConfiguration, artifactory) {
          return beforeEach(
            subject,
            this.initialValues,
            testResourceConfiguration,
            (fPath: string, value: unknown) => artifactory(`before/${fPath}`, value),
            this.initialValues
          );
        }

        afterEach(
          store: IStore,
          key: string,
          artifactory
        ): Promise<unknown> {
          return new Promise((res) =>
            res(afterEach(store, key, (fPath: string, value: unknown) =>
              // TODO does not work?
              artifactory(`afterEach2-${this.name}/${fPath}`, value)))
          );
        }
      } as any,

      testResourceRequirement,
      logWriter
    );
  }

  abstract receiveTestResourceConfigUnscheduled(t: ITestJob, partialTestResource: ITTestResourceConfiguration);
  abstract receiveTestResourceConfigScheduled(t: ITestJob, partialTestResource: ITTestResourceConfiguration);

}
