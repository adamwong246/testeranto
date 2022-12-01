import { mapValues } from "lodash";
export class BaseSuite {
    constructor(name, givens = [], checks = []) {
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
export class BaseGiven {
    constructor(name, whens, thens) {
        this.name = name;
        this.whens = whens;
        this.thens = thens;
    }
    async teardown(subject) {
        return subject;
    }
    async give(subject) {
        console.log(`\n Given: ${this.name}`);
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
export class BaseWhen {
    constructor(name, actioner) {
        this.name = name;
        this.actioner = actioner;
    }
    async test(store) {
        console.log(" When:", this.name);
        return await this.andWhen(store, this.actioner);
    }
}
export class BaseThen {
    constructor(name, callback) {
        this.name = name;
        this.callback = callback;
    }
    async test(store) {
        console.log(" Then:", this.name);
        return this.callback(await this.butThen(store));
    }
}
export class BaseCheck {
    constructor(feature, callback, whens, thens) {
        this.feature = feature;
        this.callback = callback;
        this.whens = whens;
        this.thens = thens;
    }
    async teardown(subject) {
        return subject;
    }
    async check(subject) {
        console.log(`\n - \nCheck: ${this.feature}`);
        const store = await this.checkThat(subject);
        await this.callback(mapValues(this.whens, (when) => {
            return async (payload) => {
                return await when(payload).test(store);
            };
        }), mapValues(this.thens, (then) => {
            return async (payload) => {
                return await then(payload).test(store);
            };
        }));
        await this.teardown(store);
        return;
    }
}
