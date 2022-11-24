export abstract class BaseSuite<ISubject, IStore, ISelection> {
  name: string;
  givens: BaseGiven<ISubject, IStore, ISelection>[];

  constructor(name: string, givens: BaseGiven<ISubject, IStore, ISelection>[]) {
    this.name = name;
    this.givens = givens;
  }

  test(subject) {
    console.log("\nSuite:", this.name);
    this.givens.forEach(
      (givenThat: BaseGiven<ISubject, IStore, ISelection>) => {
        givenThat.test(subject);
      }
    );
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

  test(subject: ISubject) {
    console.log(`\n - ${this.feature} - \n\nGiven: ${this.name}`);
    const store = this.givenThat(subject);

    this.whens.forEach((whenStep) => {
      whenStep.test(store);
    });

    this.thens.forEach((thenStep) => {
      thenStep.test(store);
    });
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

  test(store: IStore): IStore {
    console.log(" When:", this.name);
    return this.andWhen(store, this.actioner);
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

  test(store: any) {
    console.log(" Then:", this.name);
    return this.callback(this.butThen(store));
  }
}
