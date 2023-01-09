import { BaseGiven, BaseCheck, BaseSuite, BaseFeature, BaseWhen, BaseThen } from "./BaseClasses";
import { TesterantoLevelOne } from "./lib/level1";
import { ITestImplementation, ITestSpecification, ITTestResource, ITTestResourceRequirement, ITTestShape, Modify } from "./types"

export type { ITestImplementation, ITestSpecification, ITTestShape, Modify };

export const Testeranto = <
  TestShape extends ITTestShape,
  Input,
  Subject,
  Store,
  Selection,
  WhenShape,
  ThenShape,
  InitialStateShape
>(
  input: Input,
  testSpecification: ITestSpecification<TestShape>,
  testImplementation,
  // testImplementation: ITestImplementation<
  //   InitialStateShape,
  //   Selection,
  //   WhenShape,
  //   ThenShape,
  //   TestShape
  // >,
  testResource: ITTestResourceRequirement,

  testInterface: {
    actionHandler?: (b: (...any) => any) => any,
    afterEach?: (store: Store, ndx: number, cb) => unknown,
    andWhen: (store: Store, actioner, testResource: ITTestResource) => Promise<Selection>,
    assertioner?: (t: ThenShape) => any,
    beforeAll?: (input: Input) => Promise<Subject>,
    beforeEach?: (subject: Subject, initialValues, testResource: ITTestResource) => Promise<Store>,
    butThen?: (store: Store, callback, testResource: ITTestResource) => Promise<Selection>,
  },

) => {

  const butThen = testInterface.butThen || (async (a) => a as any);
  const { andWhen } = testInterface;
  const actionHandler = testInterface.actionHandler || function (b: (...any: any[]) => any) {
    return b;
  };
  const assertioner = testInterface.assertioner || (async (t) => t as any);
  const beforeAll = testInterface.beforeAll || (async (input) => input as any);
  const beforeEach = testInterface.beforeEach || async function (subject: Input, initialValues: any, testResource: any) {
    return subject as any;
  }
  const afterEach = testInterface.afterEach || (async (s) => s);

  return class extends TesterantoLevelOne<
    TestShape,
    InitialStateShape,
    Selection,
    Store,
    Subject,
    WhenShape,
    ThenShape,
    // ITTestResource,
    Input
  > {
    constructor() {
      super(
        testImplementation,
        /* @ts-ignore:next-line */
        testSpecification,
        input,
        (class extends BaseSuite<Input, Subject, Store, Selection, ThenShape> {
          async setup(s: Input): Promise<Subject> {
            return beforeAll(s);
          }
          test(t: ThenShape): unknown {
            return assertioner(t);
          }
        }),

        class Given extends BaseGiven<Subject, Store, Selection, ThenShape> {
          initialValues: any;
          constructor(
            name: string,
            features: BaseFeature[],
            whens: BaseWhen<Store, Selection, ThenShape>[],
            thens: BaseThen<Selection, Store, ThenShape>[],
            initialValues: any
          ) {
            super(name, features, whens, thens);
            this.initialValues = initialValues;
          }
          async givenThat(subject, testResource) {
            return beforeEach(subject, this.initialValues, testResource);
          }
          afterEach(store: Store, ndx: number, cb): Promise<unknown> {
            return new Promise((res) => res(afterEach(store, ndx, cb)))
          }
        },

        class When extends BaseWhen<Store, Selection, WhenShape> {
          payload?: any;

          constructor(name: string, actioner: (...any) => any, payload?: any) {
            super(name, (store) => {
              return actionHandler(actioner)
            });
            this.payload = payload;
          }

          async andWhen(store, actioner, testResource) {
            return await andWhen(store, actioner, testResource);
          }
        },

        class Then extends BaseThen<Selection, Store, ThenShape> {
          constructor(
            name: string,
            callback: (val: Selection) => ThenShape
          ) {
            super(name, callback);
          }

          async butThen(store: any, testResourceConfiguration?: any): Promise<Selection> {
            return await butThen(store, this.thenCB, testResourceConfiguration)
          }
        },

        class Check extends BaseCheck<Subject, Store, Selection, ThenShape> {
          initialValues: any;

          constructor(
            name: string,
            features: BaseFeature[],
            checkCallback: (a, b) => any,
            whens,
            thens,
            initialValues: any,
          ) {
            super(name, features, checkCallback, whens, thens);
            this.initialValues = initialValues;
          }

          async checkThat(subject, testResource) {
            return beforeEach(subject, this.initialValues, testResource);
          }

          afterEach(store: Store, ndx: number, cb): Promise<unknown> {
            return new Promise((res) => res(afterEach(store, ndx, cb)))
          }
        },
        testResource
      );
    }
  }
};
