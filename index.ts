export abstract class TesterantoSuite<
  IStore,
  ISelected,
> {
  name: string;
  subject: IStore;
  givens: TesterantoGiven<IStore, ISelected>[];

  constructor(
    name: string,
    subject: IStore,
    givens: TesterantoGiven<IStore, ISelected>[],

  ) {
    this.name = name;
    this.subject = subject;
    this.givens = givens;
  }

  run() {
    console.log("\nSuite:", this.name)
    this.givens.forEach((g) => {
      g.run(this.subject);
    })
  }
}

export abstract class TesterantoGiven<
  IStore,
  ISelected,
> {
  name: string;
  whens: TesterantoWhen<IStore>[];
  thens: TesterantoThen<ISelected>[];
  feature: string;
  constructor(
    name: string,
    whens: TesterantoWhen<IStore>[],
    thens: TesterantoThen<ISelected>[],
    feature: string
  ) {
    this.name = name;
    this.whens = whens;
    this.thens = thens;
    this.feature = feature;
  }

  abstract given(subject): any;

  run(subject: any) {
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
  actionCreator: (x: any) => any;
  payload: object;
  constructor(
    name: string,
    actionCreator: (x) => any,
    payload: any = {}
  ) {
    this.name = name;
    this.actionCreator = actionCreator;
    this.payload = payload;
  }

  abstract when(store: IStore, action: any): any;

  run(store: IStore) {
    console.log(" When:", this.name);
    const action = this.actionCreator;
    action(store);
    this.when(store, action)
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
    console.log(" Then:", this.name)
    this.callback(this.then(store))
  }
};

export class Suite<Klass> extends TesterantoSuite<Klass, Klass> { };

export class Given<Klass> extends TesterantoGiven<Klass, any> {
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
  constructor(
    name: string,
    actionCreator: (x: Klass) => any,
    payload: any = {}
  ) {
    super(name, actionCreator, payload);
  }

  when(thing: Klass) {
    return thing;
  }

};

export class Then<Klass> extends TesterantoThen<Klass> {
  constructor(
    name: string,
    callback: (thing: Klass) => void
  ) {
    super(name, callback);
  }

  then(rectangle: Klass) {
    return rectangle;
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