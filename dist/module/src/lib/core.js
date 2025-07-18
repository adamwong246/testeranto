/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultTestInterface, defaultTestResourceRequirement, } from "./index.js";
import { BaseGiven, BaseWhen, BaseThen, BaseCheck } from "./abstractBase.js";
import { ClassBuilder } from "./classBuilder.js";
import { BaseSuite } from "./BaseSuite.js";
export default class TesterantoCore extends ClassBuilder {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testInterface, uberCatcher) {
        const fullTestInterface = DefaultTestInterface(testInterface);
        super(testImplementation, testSpecification, input, class extends BaseSuite {
            afterAll(store, artifactory, pm) {
                return fullTestInterface.afterAll(store, pm);
            }
            assertThat(t) {
                return fullTestInterface.assertThis(t);
            }
            async setup(s, artifactory, tr, pm) {
                return (fullTestInterface.beforeAll ||
                    (async (input, artifactory, tr, pm) => input))(s, this.testResourceConfiguration, 
                // artifactory,
                pm);
            }
        }, class Given extends BaseGiven {
            constructor() {
                super(...arguments);
                this.uberCatcher = uberCatcher;
            }
            async givenThat(subject, testResource, artifactory, initializer, initialValues, pm) {
                return fullTestInterface.beforeEach(subject, initializer, testResource, initialValues, pm);
            }
            afterEach(store, key, artifactory, pm) {
                return new Promise((res) => res(fullTestInterface.afterEach(store, key, pm)));
            }
        }, class When extends BaseWhen {
            async andWhen(store, whenCB, testResource, pm) {
                return await fullTestInterface.andWhen(store, whenCB, testResource, pm);
            }
        }, class Then extends BaseThen {
            async butThen(store, thenCB, testResource, pm) {
                return await fullTestInterface.butThen(store, thenCB, testResource, pm);
            }
        }, class Check extends BaseCheck {
            constructor(name, features, checkCallback, x, i, c) {
                super(name, features, checkCallback, x, c);
                this.initialValues = i;
            }
            async checkThat(subject, testResourceConfiguration, artifactory, initializer, initialValues, pm) {
                return fullTestInterface.beforeEach(subject, initializer, testResourceConfiguration, initialValues, pm);
            }
            afterEach(store, key, artifactory, pm) {
                return new Promise((res) => res(fullTestInterface.afterEach(store, key, pm)));
            }
        }, testResourceRequirement);
    }
}
