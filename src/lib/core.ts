import {
  ITestSpecification,
  ITestImplementation,
  ITestInterface,
  IT,
  OT,
} from "../Types.js";

import {
  DefaultTestInterface,
  IFinalResults,
  ITTestResourceRequest,
  ITestArtifactory,
  defaultTestResourceRequirement,
} from "./index.js";
import {
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
  BaseCheck,
} from "./abstractBase.js";
import { ClassBuilder } from "./classBuilder.js";
import { IPM } from "./types";

export default abstract class Testeranto<
  I extends IT,
  O extends OT,
  M
> extends ClassBuilder<I, O, M> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M>,
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    testInterface: Partial<ITestInterface<I>>,
    uberCatcher: (cb: () => void) => void
  ) {
    const fullTestInterface = DefaultTestInterface(testInterface);

    super(
      testImplementation,
      testSpecification,
      input,

      class extends BaseSuite<I, O> {
        afterAll(store: I["istore"], artifactory: ITestArtifactory, pm: IPM) {
          return fullTestInterface.afterAll(store, pm);
        }

        assertThat(t): boolean {
          return fullTestInterface.assertThis(t);
        }

        async setup(
          s: I["iinput"],
          artifactory: ITestArtifactory,
          tr,
          pm
        ): Promise<I["isubject"]> {
          return (
            fullTestInterface.beforeAll ||
            (async (
              input: I["iinput"],
              artifactory: ITestArtifactory,
              tr,
              pm: IPM
            ) => input as any)
          )(
            s,
            this.testResourceConfiguration,
            // artifactory,
            pm
          );
        }
      } as any,

      class Given extends BaseGiven<I> {
        uberCatcher = uberCatcher;

        async givenThat(
          subject,
          testResource,
          artifactory,
          initializer,
          initialValues,
          pm
        ) {
          return fullTestInterface.beforeEach(
            subject,
            initializer,
            testResource,
            initialValues,
            pm
          );
        }

        afterEach(
          store: I["istore"],
          key: string,
          artifactory,
          pm
        ): Promise<unknown> {
          return new Promise((res) =>
            res(fullTestInterface.afterEach(store, key, pm))
          );
        }
        s;
      } as any,

      class When extends BaseWhen<I> {
        async andWhen(store, whenCB, testResource, pm) {
          try {
            return await fullTestInterface.andWhen(
              store,
              whenCB,
              testResource,
              pm
            );
          } catch (e) {
            throw e;
          }
        }
      } as any,

      class Then extends BaseThen<I> {
        async butThen(
          store: any,
          thenCB,
          testResource: any,
          pm: IPM
        ): Promise<I["iselection"]> {
          return await fullTestInterface.butThen(
            store,
            thenCB,
            testResource,
            pm
          );
        }
      } as any,

      class Check extends BaseCheck<I> {
        initialValues: any;

        constructor(
          name: string,
          features: string[],
          checkCallback: (s: I["istore"], pm: IPM) => any,
          x,
          i,
          c
        ) {
          super(name, features, checkCallback, x, c);
          this.initialValues = i;
        }

        async checkThat(
          subject,
          testResourceConfiguration,
          artifactory,
          initializer,
          initialValues,
          pm
        ) {
          return fullTestInterface.beforeEach(
            subject,
            initializer,
            testResourceConfiguration,
            initialValues,
            pm
          );
        }

        afterEach(
          store: I["istore"],
          key: string,
          artifactory,
          pm
        ): Promise<unknown> {
          return new Promise((res) =>
            res(fullTestInterface.afterEach(store, key, pm))
          );
        }
      } as any,

      testResourceRequirement
    );
  }

  abstract receiveTestResourceConfig(
    partialTestResource: string
  ): Promise<IFinalResults>;
}
