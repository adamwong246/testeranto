import { BaseGiven, BaseCheck, BaseSuite, BaseWhen, BaseThen } from "./BaseClasses";
import { TesterantoLevelOne } from "./lib/level1";
export const Testeranto = (input, testSpecification, testImplementation, 
// testImplementation: ITestImplementation<
//   InitialStateShape,
//   Selection,
//   WhenShape,
//   ThenShape,
//   TestShape
// >,
testResource, testInterface) => {
    const butThen = testInterface.butThen || (async (a) => a);
    const { andWhen } = testInterface;
    const actionHandler = testInterface.actionHandler || function (b) {
        return b;
    };
    const assertioner = testInterface.assertioner || (async (t) => t);
    const beforeAll = testInterface.beforeAll || (async (input) => input);
    const beforeEach = testInterface.beforeEach || async function (subject, initialValues, testResource) {
        return subject;
    };
    const afterEach = testInterface.afterEach || (async (s) => s);
    return class extends TesterantoLevelOne {
        constructor() {
            super(testImplementation, 
            /* @ts-ignore:next-line */
            testSpecification, input, (class extends BaseSuite {
                async setup(s) {
                    return beforeAll(s);
                }
                test(t) {
                    return assertioner(t);
                }
            }), class Given extends BaseGiven {
                constructor(name, features, whens, thens, initialValues) {
                    super(name, features, whens, thens);
                    this.initialValues = initialValues;
                }
                async givenThat(subject, testResource) {
                    return beforeEach(subject, this.initialValues, testResource);
                }
                afterEach(store, ndx, cb) {
                    return new Promise((res) => res(afterEach(store, ndx, cb)));
                }
            }, class When extends BaseWhen {
                constructor(name, actioner, payload) {
                    super(name, (store) => {
                        return actionHandler(actioner);
                    });
                    this.payload = payload;
                }
                async andWhen(store, actioner, testResource) {
                    return await andWhen(store, actioner, testResource);
                }
            }, class Then extends BaseThen {
                constructor(name, callback) {
                    super(name, callback);
                }
                async butThen(store, testResourceConfiguration) {
                    return await butThen(store, this.thenCB, testResourceConfiguration);
                }
            }, class Check extends BaseCheck {
                constructor(name, features, checkCallback, whens, thens, initialValues) {
                    super(name, features, checkCallback, whens, thens);
                    this.initialValues = initialValues;
                }
                async checkThat(subject, testResource) {
                    return beforeEach(subject, this.initialValues, testResource);
                }
                afterEach(store, ndx, cb) {
                    return new Promise((res) => res(afterEach(store, ndx, cb)));
                }
            }, testResource);
        }
    };
};
