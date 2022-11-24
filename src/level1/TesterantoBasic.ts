import {
  BaseGiven,
  BaseSuite,
  BaseWhen,
  BaseThen,
} from "../level0/AbstractClasses";

export abstract class TesterantoBasic<
  ISubject,
  IStore,
  ISelection,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions
> {
  constructorator: IStore;

  suitesOverrides: Record<
    keyof SuiteExtensions,
    (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection>[]
    ) => BaseSuite<ISubject, IStore, ISelection>
  >;

  givenOverides: Record<
    keyof GivenExtensions,
    (
      feature: string,
      whens: BaseWhen<IStore>[],
      thens: BaseThen<ISelection>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection>
  >;

  whenOverides: Record<keyof WhenExtensions, (any) => BaseWhen<IStore>>;
  thenOverides: Record<
    keyof ThenExtensions,
    (selection: ISelection, expectation: any) => BaseThen<ISelection>
  >;

  constructor(
    public readonly cc: IStore,
    suitesOverrides: Record<
      keyof SuiteExtensions,
      (
        name: string,
        givens: BaseGiven<ISubject, IStore, ISelection>[]
      ) => BaseSuite<ISubject, IStore, ISelection>
    >,

    givenOverides: Record<
      keyof GivenExtensions,
      (
        feature: string,
        whens: BaseWhen<IStore>[],
        thens: BaseThen<ISelection>[],
        ...xtraArgs
      ) => BaseGiven<ISubject, IStore, ISelection>
    >,
    whenOverides: Record<keyof WhenExtensions, (c: any) => BaseWhen<IStore>>,
    thenOverides: Record<
      keyof ThenExtensions,
      (selection: ISelection, expectation: any) => BaseThen<ISelection>
    >
  ) {
    this.constructorator = cc;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
  }

  Suites() {
    return this.suitesOverrides;
  }

  Given(): Record<
    keyof GivenExtensions,
    (
      feature: string,
      whens: BaseWhen<IStore>[],
      thens: BaseThen<ISelection>[],
      ...xtraArgs
    ) => BaseGiven<ISubject, IStore, ISelection>
  > {
    return this.givenOverides;
  }

  When(): Record<
    keyof WhenExtensions,
    (arg0: IStore, ...arg1: any) => BaseWhen<IStore>
  > {
    return this.whenOverides;
  }

  Then(): Record<
    keyof ThenExtensions,
    (selection: ISelection, expectation: any) => BaseThen<ISelection>
  > {
    return this.thenOverides;
  }
}
