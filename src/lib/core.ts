import { IStore } from "../SubPackages/react/jsx";
import {
  IBaseTest,
  ITestSpecification,
  ITestImplementation,
} from "../Types.js";

import { ITestInterface } from "./types.js";
import {
  DefaultTestInterface,
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
import { PM } from "../PM/index";

export default abstract class Testeranto<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> extends ClassBuilder<ITestShape> {
  constructor(
    input: ITestShape["iinput"],
    testSpecification: ITestSpecification<ITestShape>,
    testImplementation: ITestImplementation<ITestShape>,
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    testInterface: Partial<ITestInterface<ITestShape>>,
    uberCatcher: (cb) => void
  ) {
    const fullTestInterface = DefaultTestInterface(testInterface);

    super(
      testImplementation,
      testSpecification,
      input,

      class extends BaseSuite<ITestShape> {
        afterAll(store: IStore, artifactory: ITestArtifactory, pm: PM) {
          return fullTestInterface.afterAll(
            store,
            (fPath: string, value: unknown) =>
              // TODO does not work?
              {
                artifactory(`afterAll4-${this.name}/${fPath}`, value);
              },
            pm
          );
        }

        assertThat(t) {
          fullTestInterface.assertThis(t);
        }

        async setup(
          s: ITestShape["iinput"],
          artifactory: ITestArtifactory,
          tr,
          pm
        ): Promise<ITestShape["isubject"]> {
          return (
            fullTestInterface.beforeAll ||
            (async (
              input: ITestShape["iinput"],
              artifactory: ITestArtifactory,
              tr,
              pm: PM
            ) => input as any)
          )(s, this.testResourceConfiguration, artifactory, pm);
        }
      } as any,

      class Given extends BaseGiven<ITestShape> {
        uberCatcher = uberCatcher;

        async givenThat(subject, testResource, artifactory, initializer, pm) {
          return fullTestInterface.beforeEach(
            subject,
            initializer,
            testResource,
            this.initialValues,
            pm
          );
        }

        afterEach(
          store: ITestShape["istore"],
          key: string,
          artifactory,
          pm
        ): Promise<unknown> {
          return new Promise((res) =>
            res(
              fullTestInterface.afterEach(
                store,
                key,
                (fPath: string, value: unknown) =>
                  artifactory(`after/${fPath}`, value),
                pm
              )
            )
          );
        }
      } as any,

      class When extends BaseWhen<ITestShape> {
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
          // return fullTestInterface
          //   .andWhen(store, whenCB, testResource, pm)
          //   .catch((e) => {
          //     throw e;
          //   });
          // return new Promise((res, rej) => {
          //   fullTestInterface.andWhen(store, whenCB, testResource, pm);
          // });
          // return await fullTestInterface.andWhen(
          //   store,
          //   whenCB,
          //   testResource,
          //   pm
          // );
        }
      } as any,

      class Then extends BaseThen<ITestShape> {
        async butThen(
          store: any,
          thenCB,
          testResource: any,
          pm: PM
        ): Promise<ITestShape["iselection"]> {
          return await fullTestInterface
            .butThen(store, thenCB, testResource, pm)
            .then(
              (v) => {
                return v;
              },
              (e) => {
                console.log(" ERROR ", e);
                throw e;
              }
            );
          // try {
          //   console.log("mark 4");
          //   return await fullTestInterface.butThen(
          //     store,
          //     thenCB,
          //     testResource,
          //     pm
          //   );
          // } catch (e) {
          //   console.log("mar123");
          //   throw e;
          // }

          // return await fullTestInterface.butThen(
          //   store,
          //   thenCB,
          //   testResourceConfiguration,
          //   pm
          // );
        }
      } as any,

      class Check extends BaseCheck<ITestShape> {
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

        async checkThat(subject, testResourceConfiguration, artifactory, pm) {
          return fullTestInterface.beforeEach(
            subject,
            this.initialValues,
            (fPath: string, value: unknown) =>
              artifactory(`before/${fPath}`, value),
            testResourceConfiguration,
            this.initialValues,
            pm
          );
        }

        afterEach(
          store: ITestShape["istore"],
          key: string,
          artifactory,
          pm
        ): Promise<unknown> {
          return new Promise((res) =>
            res(
              fullTestInterface.afterEach(
                store,
                key,
                (fPath: string, value: unknown) =>
                  // TODO does not work?
                  artifactory(`afterEach2-${this.name}/${fPath}`, value),
                pm
              )
            )
          );
        }
      } as any,

      testResourceRequirement
      // puppetMaster
    );
  }

  abstract receiveTestResourceConfig(
    partialTestResource: string
  ): Promise<string[]>;
}
