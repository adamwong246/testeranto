import { BaseGiven, BaseCheck, BaseSuite, BaseFeature, BaseWhen, BaseThen } from "./BaseClasses";
import { Testeranto } from "./level1";
import { ITestImplementation, ITestSpecification, ITTestResource, ITTestShape } from "./testShapes"

export const TesterantoFactory = <
  TestShape extends ITTestShape,
  Input,
  Subject,
  Store,
  Selection,
  WhenShape,
  ThenShape,
  TestResourceShape,
  InitialStateShape
>(
  input: Input,
  testSpecification: ITestSpecification<TestShape>,
  testImplementation: ITestImplementation<
    InitialStateShape,
    Selection,
    WhenShape,
    ThenShape,
    TestShape
  >,
  testResource: ITTestResource,

  testInterface: {
    actionHandler?: (b: (...any) => any) => any,
    afterEach?: (store: Store, ndx: number) => unknown,
    andWhen: (store: Store, actioner, testResource: TestResourceShape) => Promise<Selection>,
    assertioner?: (t: ThenShape) => any,
    beforeAll?: (input: Input) => Promise<Subject>,
    beforeEach?: (subject: Subject, initialValues, testResource: TestResourceShape) => Promise<Store>,
    butThen?: (store: Store, callback, testResource: TestResourceShape) => Promise<Selection>,
  },
  entryPath: string

) => {

  const { andWhen } = testInterface;

  const actionHandler = testInterface.actionHandler || function (b: (...any: any[]) => any) {
    return b;
  };
  const afterEach = testInterface.afterEach || (async (s) => s as any);
  const assertioner = testInterface.assertioner || (async (t) => t as any);
  const beforeAll = testInterface.beforeAll || (async (input) => input as any);
  const butThen = testInterface.butThen || (async (a) => a as any);
  const beforeEach = testInterface.beforeEach || async function (subject: Input, initialValues: any, testResource: any) {
    return subject as any;
  }

  return class extends Testeranto<
    TestShape,
    InitialStateShape,
    Selection,
    Store,
    Subject,
    WhenShape,
    ThenShape,
    TestResourceShape,
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
            initialValues: any,
          ) {
            super(name, features, whens, thens);
            this.initialValues = initialValues;
          }
          async givenThat(subject, testResource) {
            return beforeEach(subject, this.initialValues, testResource);
          }
          afterEach(store: Store, ndx: number): Promise<unknown> {
            return new Promise((res) => res(afterEach(store, ndx)))
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

          andWhen(store, actioner, testResource) {
            return andWhen(store, actioner, testResource);
          }
        },

        class Then extends BaseThen<Selection, Store, ThenShape> {
          constructor(
            name: string,
            callback: (val: Selection) => ThenShape
          ) {
            super(name, callback);
          }

          butThen(store: any, testResourceConfiguration?: any): Promise<Selection> {
            return butThen(store, this.thenCB, testResourceConfiguration)
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

          afterEach(store: Store, ndx: number): Promise<unknown> {
            return new Promise((res) => res(afterEach(store, ndx)))
          }
        },
        testResource,
        entryPath
      );
    }
  }
};
