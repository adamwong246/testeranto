export class BaseSuite {
    constructor(name, subject, givens) {
        this.name = name;
        this.subject = subject;
        this.givens = givens;
    }
    test() {
        console.log("\nSuite:", this.name);
        this.givens.forEach((givenThat) => {
            givenThat.test(this.subject);
        });
    }
}
export class BaseGiven {
    constructor(name, whens, thens, feature) {
        this.name = name;
        this.whens = whens;
        this.thens = thens;
        this.feature = feature;
    }
    test(subject) {
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
export class BaseWhen {
    constructor(name, actioner) {
        this.name = name;
        this.actioner = actioner;
    }
    test(store) {
        console.log(" When:", this.name);
        return this.andWhen(store, this.actioner);
    }
}
;
export class BaseThen {
    constructor(name, callback) {
        this.name = name;
        this.callback = callback;
    }
    test(store) {
        console.log(" Then:", this.name);
        return this.callback(this.butThen(store));
    }
}
;
export class ClassySuite extends BaseSuite {
}
;
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
;
export class ClassyThen extends BaseThen {
    butThen(thing) {
        return thing;
    }
}
;
