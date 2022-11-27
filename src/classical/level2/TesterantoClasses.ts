import {
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
  BaseCheck,
  // BaseThat,
} from "../../base/level0/AbstractClasses";

export class ClassySuite<Klass> extends BaseSuite<Klass, Klass, Klass> {}

export class ClassyGiven<Klass> extends BaseGiven<Klass, Klass, Klass> {
  thing: Klass;

  constructor(
    name: string,
    whens: ClassyWhen<Klass>[],
    thens: ClassyThen<Klass>[],
    feature: string,
    thing: Klass
  ) {
    super(name, whens, thens, feature);
    this.thing = thing;
  }

  givenThat() {
    return this.thing;
  }
}

export class ClassyWhen<Klass> extends BaseWhen<Klass> {
  andWhen(thing: Klass): Klass {
    return this.actioner(thing);
  }
}

export class ClassyThen<Klass> extends BaseThen<Klass> {
  butThen(thing: Klass): Klass {
    return thing;
  }
}

export class ClassyCheck<Klass> extends BaseCheck<Klass, Klass, Klass> {
  thing: Klass;

  constructor(
    name: string,
    callback: (whens, thens) => any,
    feature: string,
    thing: Klass,
    whens,
    thens
  ) {
    super(feature, callback, feature, whens, thens);
    this.thing = thing;
  }

  checkThat() {
    return this.thing;
  }
}
