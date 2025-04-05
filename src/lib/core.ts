import { IStore } from "../SubPackages/react/jsx";
import {
  ITestSpecification,
  ITestImplementation,
  ITestInterface,
  Ibdd_in,
  Ibdd_out,
} from "../Types.js";
import { PM } from "../PM/index";

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

export default abstract class Testeranto<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> extends ClassBuilder<I, O> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O>,
    testResourceRequirement: ITTestResourceRequest = defaultTestResourceRequirement,
    testInterface: Partial<ITestInterface<I>>,
    uberCatcher: (cb) => void
  ) {
    const fullTestInterface = DefaultTestInterface(testInterface);

    super(
      testImplementation,
      testSpecification,
      input,

      class extends BaseSuite<I, O> {
        afterAll(store: IStore, artifactory: ITestArtifactory, pm: PM) {
          return fullTestInterface.afterAll(
            store,
            // (fPath: string, value: unknown) =>
            //   // TODO does not work?
            //   {
            //     artifactory(`afterAll4-${this.name}/${fPath}`, value);
            //   },
            pm
          );
        }

        assertThat(t) {
          fullTestInterface.assertThis(t);
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
              pm: PM
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
            // artifactory,
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
            res(
              fullTestInterface.afterEach(
                store,
                key,
                // (fPath: string, value: unknown) =>
                //   artifactory(`after/${fPath}`, value),
                pm
              )
            )
          );
        }
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

      class Then extends BaseThen<I> {
        async butThen(
          store: any,
          thenCB,
          testResource: any,
          pm: PM
        ): Promise<I["iselection"]> {
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

      class Check extends BaseCheck<I, O> {
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
            // (fPath: string, value: unknown) =>
            //   artifactory(`before/${fPath}`, value),
            testResourceConfiguration,
            this.initialValues,
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
            res(
              fullTestInterface.afterEach(
                store,
                key,
                // (fPath: string, value: unknown) =>
                //   // TODO does not work?
                //   artifactory(`afterEach2-${this.name}/${fPath}`, value),
                pm
              )
            )
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
