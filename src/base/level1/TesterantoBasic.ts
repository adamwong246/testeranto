import {
  BaseGiven,
  BaseSuite,
  BaseWhen,
  BaseThen,
  // BaseThat,
  BaseCheck,
} from "../level0/AbstractClasses";

export abstract class TesterantoBasic<
  ISubject,
  IStore,
  ISelection,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions
  // ThatExtensions
> {
  constructorator: IStore;

  suitesOverrides: Record<
    keyof SuiteExtensions,
    (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection>[],
      checks: BaseCheck<ISubject, IStore, ISelection>[]
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

  checkOverides: Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      ...xtraArgs
    ) => BaseCheck<ISubject, IStore, ISelection>
  >;

  // thatOverides: Record<
  //   keyof ThatExtensions,
  //   (selection: ISelection, expectation: any) => BaseThat<ISelection>
  // >;

  constructor(
    public readonly cc: IStore,
    suitesOverrides: Record<
      keyof SuiteExtensions,
      (
        name: string,
        givens: BaseGiven<ISubject, IStore, ISelection>[],
        checks: BaseCheck<ISubject, IStore, ISelection>[]
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
    >,

    checkOverides: Record<
      keyof CheckExtensions,
      (
        feature: string,
        callback: (whens, thens) => any,
        ...xtraArgs
      ) => BaseCheck<ISubject, IStore, ISelection>
    >

    // thatOverides: Record<
    //   keyof ThatExtensions,
    //   (selection: ISelection, expectation: any) => BaseThat<ISelection>
    // >
  ) {
    this.constructorator = cc;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.checkOverides = checkOverides;
    // this.thatOverides = thatOverides;
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

  Check(): Record<
    keyof CheckExtensions,
    (
      feature: string,
      callback: (whens, thens) => any,
      whens,
      thens
    ) => BaseCheck<ISubject, IStore, ISelection>
  > {
    console.log("mark3");
    return this.checkOverides;
  }

  // That(): Record<
  //   keyof ThatExtensions,
  //   (selection: ISelection, expectation: any) => BaseThat<ISelection>
  // > {
  //   return this.thatOverides;
  // }
}
