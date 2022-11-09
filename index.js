export class TesterantoSuite {
    constructor(name, subject, givens) {
        this.name = name;
        this.subject = subject;
        this.givens = givens;
    }
    run() {
        console.log("\nSuite:", this.name);
        this.givens.forEach((g) => {
            g.give(this.subject);
        });
    }
}
export class TesterantoGiven {
    constructor(name, whens, thens, feature) {
        this.name = name;
        this.whens = whens;
        this.thens = thens;
        this.feature = feature;
    }
    give(subject) {
        console.log(`\n - ${this.feature} - \n\nGiven: ${this.name}`);
        const store = this.given(subject);
        this.whens.forEach((when) => {
            when.run(store);
        });
        this.thens.forEach((then) => {
            then.run(store);
        });
    }
}
export class TesterantoWhen {
    constructor(name, actioner) {
        this.name = name;
        this.actioner = actioner;
    }
    run(store) {
        console.log(" When:", this.name);
        this.when(store, this.actioner);
    }
}
;
export class TesterantoThen {
    constructor(name, callback) {
        this.name = name;
        this.callback = callback;
    }
    run(store) {
        console.log(" Then:", this.name);
        return this.callback(this.then(store));
    }
}
;
export class Suite extends TesterantoSuite {
}
;
export class Given extends TesterantoGiven {
    constructor(name, whens, thens, feature, thing) {
        super(name, whens, thens, feature);
        this.thing = thing;
    }
    given() {
        return this.thing;
    }
}
export class When extends TesterantoWhen {
    when(thing) {
        return this.actioner(thing);
    }
}
;
export class Then extends TesterantoThen {
    then(thing) {
        return thing;
    }
}
;
export const TesterantoFactory = {
    Suite: Suite,
    Given: Given,
    When: When,
    Then: Then,
};
