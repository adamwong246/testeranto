export abstract class BaseSuite<
  ISubject,
  IStore,
  ISelection,
> {
  name: string;
  subject: ISubject;
  givens: BaseGiven<ISubject, IStore, ISelection>[];

  constructor(
    name: string,
    subject: ISubject,
    givens: BaseGiven<ISubject, IStore, ISelection>[],

  ) {
    this.name = name;
    this.subject = subject;
    this.givens = givens;
  }

  run() {
    console.log("\nSuite:", this.name)
    this.givens.forEach((g: BaseGiven<any, any, any>) => {
      g.give(this.subject);
    })
  }
}

export abstract class BaseGiven<
  ISubject,
  IStore,
  ISelection,
> {
  name: string;
  whens: BaseWhen<IStore>[];
  thens: BaseThen<ISelection>[];
  feature: string;

  constructor(
    name: string,
    whens: BaseWhen<IStore>[],
    thens: BaseThen<ISelection>[],
    feature: string,
  ) {
    this.name = name;
    this.whens = whens;
    this.thens = thens;
    this.feature = feature;
  }

  abstract given(subject: ISubject): IStore;

  give(subject: ISubject) {
    console.log(`\n - ${this.feature} - \n\nGiven: ${this.name}`)
    const store = this.given(subject);

    this.whens.forEach((when) => {
      when.run(store);
    });

    this.thens.forEach((then) => {
      then.run(store);
    });
  }

}

export abstract class BaseWhen<
  IStore,
> {
  name: string;
  actioner: (x: any) => any;
  constructor(
    name: string,
    actioner: (x) => any,
  ) {
    this.name = name;
    this.actioner = actioner;
  }

  abstract when(store: IStore, actioner: (x) => any): any;

  run(store: IStore): IStore {
    console.log(" When:", this.name);
    return this.when(store, this.actioner)
  }
};

export abstract class BaseThen<
  ISelected,
> {
  name: string;
  callback: (storeState: ISelected) => any;

  constructor(
    name: string,
    callback: (val: ISelected) => any
  ) {
    this.name = name;
    this.callback = callback;
  }

  abstract then(store: any): ISelected;

  run(store: any) {
    console.log(" Then:", this.name);
    return this.callback(this.then(store));
  }
};

export class ClassySuite<Klass> extends BaseSuite<Klass, Klass, Klass> { };

export class ClassyGiven<Klass> extends BaseGiven<Klass, Klass, Klass> {
  thing: Klass;

  constructor(
    name: string,
    whens: ClassyWhen<Klass>[],
    thens: ClassyThen<Klass>[],
    feature: string,
    thing: Klass,
  ) {
    super(name, whens, thens, feature);
    this.thing = thing;
  }

  given() {
    return this.thing;
  }
}

export class ClassyWhen<Klass> extends BaseWhen<Klass> {
  when(thing: Klass): Klass {
    return this.actioner(thing);
  }
};

export class ClassyThen<Klass> extends BaseThen<Klass> {
  then(thing: Klass): Klass {
    return thing;
  }
};
