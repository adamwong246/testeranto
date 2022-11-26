import {
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
  BaseCheck,
  BaseThat,
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
    thats: ClassyThat<Klass>[],
    feature: string,
    thing: Klass
  ) {
    super(feature, thats);
    this.thing = thing;
  }

  checkThat() {
    return this.thing;
  }
}

export class ClassyThat<Klass> extends BaseThat<Klass> {
  forThat(thing: Klass): Klass {
    return thing;
  }
}
