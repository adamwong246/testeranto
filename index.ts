export abstract class TesterantoSuite<
  ISubject,
  IStore,
  ISelection,
> {
  name: string;
  subject: ISubject;
  givens: TesterantoGiven<ISubject, IStore, ISelection>[];

  constructor(
    name: string,
    subject: ISubject,
    givens: TesterantoGiven<ISubject, IStore, ISelection>[],

  ) {
    this.name = name;
    this.subject = subject;
    this.givens = givens;
  }

  run() {
    console.log("\nSuite:", this.name)
    this.givens.forEach((g: TesterantoGiven<any, any, any>) => {
      g.give(this.subject);
    })
  }
}

export abstract class TesterantoGiven<
  ISubject,
  IStore,
  ISelection,
> {
  name: string;
  whens: TesterantoWhen<IStore>[];
  thens: TesterantoThen<ISelection>[];
  feature: string;

  constructor(
    name: string,
    whens: TesterantoWhen<IStore>[],
    thens: TesterantoThen<ISelection>[],
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

export abstract class TesterantoWhen<
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

export abstract class TesterantoThen<
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

export class Suite<Klass> extends TesterantoSuite<Klass, Klass, Klass> { };

export class Given<Klass> extends TesterantoGiven<Klass, Klass, Klass> {
  thing: Klass;

  constructor(
    name: string,
    whens: When<Klass>[],
    thens: Then<Klass>[],
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

export class When<Klass> extends TesterantoWhen<Klass> {

  when(thing: Klass): Klass {
    return this.actioner(thing);
  }

};

export class Then<Klass> extends TesterantoThen<Klass> {
  then(thing: Klass): Klass {
    return thing;
  }
};

export const TesterantoFactory = {
  Suite: Suite,
  Given: Given,
  When: When,
  Then: Then,
}

export type ITesterantoFactory<Klass> = {
  Suite: Suite<Klass>;
  Given: Given<Klass>;
  When: When<Klass>;
  Then: Then<Klass>;
}