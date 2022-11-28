import { BaseSuite, BaseGiven, BaseWhen, BaseThen, BaseCheck,
// BaseThat,
 } from "../../base/level0/AbstractClasses";
export class ClassySuite extends BaseSuite {
}
export class ClassyGiven extends BaseGiven {
    constructor(name, whens, thens, feature, thing) {
        super(name, whens, thens, feature);
        this.thing = thing;
    }
    givenThat() {
        return this.thing;
    }
}
export class ClassyWhen extends BaseWhen {
    andWhen(thing) {
        return this.actioner(thing);
    }
}
export class ClassyThen extends BaseThen {
    butThen(thing) {
        return thing;
    }
}
export class ClassyCheck extends BaseCheck {
    constructor(feature, callback, whens, thens, thing) {
        super(feature, callback, whens, thens);
        this.thing = thing;
    }
    checkThat() {
        return this.thing;
    }
}
