export abstract class BaseSuite<ISubject, IStore, ISelection> {
  name: string;
  givens: BaseGiven<ISubject, IStore, ISelection>[];
  checks: BaseCheck<ISubject, IStore, ISelection>[];

  constructor(
    name: string,
    givens: BaseGiven<ISubject, IStore, ISelection>[],
    checks: BaseCheck<ISubject, IStore, ISelection>[]
  ) {
    console.log("constructor", name, checks);
    this.name = name;
    this.givens = givens;
    this.checks = checks;
  }

  async run(subject) {
    console.log("\nSuite:", this.name);
    for (const givenThat of this.givens) {
      await givenThat.give(subject);
    }

    for (const checkThat of this.checks) {
      await checkThat.check(subject);
    }
  }
}

export abstract class BaseGiven<ISubject, IStore, ISelection> {
  name: string;
  whens: BaseWhen<IStore>[];
  thens: BaseThen<ISelection>[];
  feature: string;

  constructor(
    name: string,
    whens: BaseWhen<IStore>[],
    thens: BaseThen<ISelection>[],
    feature: string
  ) {
    this.name = name;
    this.whens = whens;
    this.thens = thens;
    this.feature = feature;
  }

  abstract givenThat(subject: ISubject): IStore;

  async teardown(subject: any) {
    return subject;
  }

  async give(subject: ISubject) {
    console.log(`\n - ${this.feature} - \n\nGiven: ${this.name}`);
    const store = await this.givenThat(subject);

    for (const whenStep of this.whens) {
      await whenStep.test(store);
    }

    for (const thenStep of this.thens) {
      await thenStep.test(store);
    }

    await this.teardown(store);
    return;
  }
}

export abstract class BaseWhen<IStore> {
  name: string;
  actioner: (x: any) => any;
  constructor(name: string, actioner: (x) => any) {
    this.name = name;
    this.actioner = actioner;
  }

  abstract andWhen(store: IStore, actioner: (x) => any): any;

  async test(store: IStore) {
    console.log(" When:", this.name);
    return await this.andWhen(store, this.actioner);
  }
}

export abstract class BaseThen<ISelection> {
  name: string;
  callback: (storeState: ISelection) => any;

  constructor(name: string, callback: (val: ISelection) => any) {
    this.name = name;
    this.callback = callback;
  }

  abstract butThen(store: any): ISelection;

  async test(store: any) {
    console.log(" Then:", this.name);
    return this.callback(await this.butThen(store));
  }
}

export abstract class BaseCheck<ISubject, IStore, ISelection> {
  feature: string;
  thats: BaseThat<IStore>[];

  constructor(feature: string, thats: BaseThat<IStore>[]) {
    this.feature = feature;
    this.thats = thats;
  }

  abstract checkThat(subject: ISubject): IStore;

  async teardown(subject: any) {
    return subject;
  }

  async check(subject: ISubject) {
    console.log(`\n - \nCheck: ${this.feature}`);
    const store = await this.checkThat(subject);

    for (const thatStep of this.thats) {
      await thatStep.that(store);
    }
    await this.teardown(store);
    return;
  }
}

export abstract class BaseThat<ISelection> {
  name: string;
  callback: (storeState: ISelection) => any;

  constructor(name: string, callback: (val: ISelection) => any) {
    this.name = name;
    this.callback = callback;
  }

  abstract forThat(store: any): ISelection;

  async that(store: any) {
    console.log(" That:", this.name);
    return this.callback(await this.forThat(store));
  }
}
