import { BaseGiven, BaseCheck, BaseSuite, BaseFeature, BaseWhen, BaseThen } from "../BaseClasses";
import { ITTestShape } from "../types";

export abstract class TesterantoLevelZero<
  IInput,
  ISubject,
  IStore,
  ISelection,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions,
  IThenShape
> {
  constructorator: IStore;

  suitesOverrides: Record<
    keyof SuiteExtensions,
    (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>[]
    ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITTestShape>
  >;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      name: string,
      features: BaseFeature[],
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>
  >;

  whenOverides: Record<
    keyof WhenExtensions,
    (any) => BaseWhen<IStore, ISelection, IThenShape>
  >;

  thenOverides: Record<
    keyof ThenExtensions,
    (
      selection: ISelection,
      expectation: any
    ) => BaseThen<ISelection, IStore, IThenShape>
  >;

  checkOverides: Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      ...xtraArgs
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>
  >;

  constructor(
    public readonly cc: IStore,
    suitesOverrides: Record<
      keyof SuiteExtensions,
      (
        name: string,
        givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
        checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>[]
      ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITTestShape>
    >,

    givenOverides: Record<
      keyof GivenExtensions,
      (
        name: string,
        features: BaseFeature[],
        whens: BaseWhen<IStore, ISelection, IThenShape>[],
        thens: BaseThen<ISelection, IStore, IThenShape>[],
        ...xtraArgs
      ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>
    >,

    whenOverides: Record<
      keyof WhenExtensions,
      (c: any) => BaseWhen<IStore, ISelection, IThenShape>
    >,

    thenOverides: Record<
      keyof ThenExtensions,
      (
        selection: ISelection,
        expectation: any
      ) => BaseThen<ISelection, IStore, IThenShape>
    >,

    checkOverides: Record<
      keyof CheckExtensions,
      (
        feature: string,
        callback: (whens, thens) => any,
        ...xtraArgs
      ) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>
    >
  ) {
    this.constructorator = cc;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
  }

  Suites() {
    return this.suitesOverrides;
  }

  Given(): Record<
    keyof GivenExtensions,
    (
      name: string,
      features: BaseFeature[],
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>
  > {
    return this.givenOverides;
  }

  When(): Record<
    keyof WhenExtensions,
    (arg0: IStore, ...arg1: any) => BaseWhen<IStore, ISelection, IThenShape>
  > {
    return this.whenOverides;
  }

  Then(): Record<
    keyof ThenExtensions,
    (
      selection: ISelection,
      expectation: any
    ) => BaseThen<ISelection, IStore, IThenShape>
  > {
    return this.thenOverides;
  }

  Check(): Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      whens,
      thens
    ) => BaseCheck<ISubject, IStore, ISelection, IThenShape, ITTestShape>
  > {
    return this.checkOverides;
  }
}
