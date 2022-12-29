import { mapValues } from "lodash";

export class BaseFeature {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export abstract class BaseSuite<
  IInput,
  ISubject,
  IStore,
  ISelection,
  IThenShape
> {
  name: string;
  givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[];
  checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[];

  constructor(
    name: string,
    givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[] = [],
    checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[] = []
  ) {
    this.name = name;
    this.givens = givens;
    this.checks = checks;
  }

  setup(s: IInput): Promise<ISubject> {
    return new Promise((res) => res(s as unknown as ISubject));
  }

  test(t: IThenShape): unknown {
    return t;
  }

  async run(input, testResourceConfiguration?) {
    const subject = await this.setup(input);

    console.log("\nSuite:", this.name, testResourceConfiguration);

    for (const [ndx, giver] of this.givens.entries()) {
      await giver.give(subject, ndx, testResourceConfiguration, this.test);
    }

    for (const [ndx, thater] of this.checks.entries()) {
      await thater.check(subject, ndx, testResourceConfiguration, this.test);
    }
  }
}

export abstract class BaseGiven<ISubject, IStore, ISelection, IThenShape> {
  name: string;
  features: BaseFeature[];
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];
  error: Error;

  constructor(
    name: string,
    features: BaseFeature[],
    whens: BaseWhen<IStore, ISelection, IThenShape>[],
    thens: BaseThen<ISelection, IStore, IThenShape>[]
  ) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
  }

  abstract givenThat(
    subject: ISubject,
    testResourceConfiguration?
  ): Promise<IStore>;

  async afterEach(subject: IStore, ndx: number): Promise<unknown> {
    return;
  }

  async give(
    subject: ISubject,
    index: number,
    testResourceConfiguration,
    tester
  ) {
    console.log(`\n Given: ${this.name}`);
    try {
      const store = await this.givenThat(subject, testResourceConfiguration);

      for (const whenStep of this.whens) {
        await whenStep.test(store, testResourceConfiguration);
      }

      for (const thenStep of this.thens) {
        const t = await thenStep.test(store, testResourceConfiguration);
        tester(t);
      }

      await this.afterEach(store, index);
    } catch (e) {  
      this.error = e;
    } 
    return;
    
    
  }
}

export abstract class BaseWhen<IStore, ISelection, IThenShape> {
  name: string;
  actioner: (x: ISelection) => IThenShape;
  error: boolean;

  constructor(name: string, actioner: (xyz: ISelection) => IThenShape) {
    this.name = name;
    this.actioner = actioner;
  }

  abstract andWhen(
    store: IStore,
    actioner: (x: ISelection) => IThenShape,
    testResource
  );

  async test(store: IStore, testResourceConfiguration?) {
    console.log(" When:", this.name);
    try {
      return await this.andWhen(store, this.actioner, testResourceConfiguration);
    } catch (e) {
      this.error = true;
      throw e
    }
  }
}

export abstract class BaseThen<ISelection, IStore, IThenShape> {
  name: string;
  thenCB: (storeState: ISelection) => IThenShape;
  error: boolean;

  constructor(name: string, thenCB: (val: ISelection) => IThenShape) {
    this.name = name;
    this.thenCB = thenCB;
  }

  abstract butThen(store: any, testResourceConfiguration?): Promise<ISelection>;

  async test(store: IStore, testResourceConfiguration): Promise<IThenShape | undefined>  {
    console.log(" Then:", this.name);

    try {
      return this.thenCB(await this.butThen(store, testResourceConfiguration));  
    } catch(e) {
      this.error = true;
      throw e
    }
    
  }
}

export abstract class BaseCheck<ISubject, IStore, ISelection, IThenShape> {
  name: string;
  features: BaseFeature[];
  checkCB: (whens, thens) => any;
  whens: BaseWhen<IStore, ISelection, IThenShape>[];
  thens: BaseThen<ISelection, IStore, IThenShape>[];

  constructor(
    name: string,
    features: BaseFeature[],
    checkCB: (
      whens: BaseWhen<IStore, ISelection, IThenShape>[],
      thens: BaseThen<ISelection, IStore, IThenShape>[]
    ) => any,
    whens: BaseWhen<IStore, ISelection, IThenShape>[],
    thens: BaseThen<ISelection, IStore, IThenShape>[]
  ) {

    this.name = name;
    this.features = features;
    this.checkCB = checkCB;
    this.whens = whens;
    this.thens = thens;

  }

  abstract checkThat(
    subject: ISubject,
    testResourceConfiguration?
  ): Promise<IStore>;

  async afterEach(subject: IStore, ndx: number): Promise<unknown> {
    return;
  }

  async check(
    subject: ISubject,
    ndx: number,
    testResourceConfiguration,
    tester
  ) {
    console.log(`\n Check: ${this.name}`);
    const store = await this.checkThat(subject, testResourceConfiguration);
    await this.checkCB(
      mapValues(this.whens, (when: (p, tc) => any) => {
        return async (payload) => {
          return await when(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration
          );
        };
      }),
      mapValues(this.thens, (then: (p, tc) => any) => {
        return async (payload) => {
          const t = await then(payload, testResourceConfiguration).test(
            store,
            testResourceConfiguration
          );
          tester(t);
        };
      })
    );

    await this.afterEach(store, ndx);
    return;
  }
}