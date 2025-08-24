/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultAdapter, defaultTestResourceRequirement, } from "./index.js";
import { BaseGiven } from "./BaseGiven.js";
import { BaseWhen } from "./BaseWhen.js";
import { BaseThen } from "./BaseThen.js";
import { ClassBuilder } from "./classBuilder.js";
import { BaseSuite } from "./BaseSuite.js";
export default class TesterantoCore extends ClassBuilder {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testAdapter, uberCatcher) {
        const fullAdapter = DefaultAdapter(testAdapter);
        super(testImplementation, testSpecification, input, class extends BaseSuite {
            afterAll(store, artifactory, pm) {
                return fullAdapter.afterAll(store, pm);
            }
            assertThat(t) {
                return fullAdapter.assertThis(t);
            }
            async setup(s, artifactory, tr, pm) {
                var _a, _b;
                return (_b = (_a = fullAdapter.beforeAll) === null || _a === void 0 ? void 0 : _a.call(fullAdapter, s, tr, pm)) !== null && _b !== void 0 ? _b : s;
            }
        }, class Given extends BaseGiven {
            constructor() {
                super(...arguments);
                this.uberCatcher = uberCatcher;
            }
            async givenThat(subject, testResource, artifactory, initializer, initialValues, pm) {
                return fullAdapter.beforeEach(subject, initializer, testResource, initialValues, pm);
            }
            afterEach(store, key, artifactory, pm) {
                return Promise.resolve(fullAdapter.afterEach(store, key, pm));
            }
        }, class When extends BaseWhen {
            async andWhen(store, whenCB, testResource, pm) {
                return await fullAdapter.andWhen(store, whenCB, testResource, pm);
            }
        }, class Then extends BaseThen {
            async butThen(store, thenCB, testResource, pm) {
                return await fullAdapter.butThen(store, thenCB, testResource, pm);
            }
        }, testResourceRequirement);
    }
}
