"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
const BaseGiven_js_1 = require("./BaseGiven.js");
const BaseWhen_js_1 = require("./BaseWhen.js");
const BaseThen_js_1 = require("./BaseThen.js");
const classBuilder_js_1 = require("./classBuilder.js");
const BaseSuite_js_1 = require("./BaseSuite.js");
class TesterantoCore extends classBuilder_js_1.ClassBuilder {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = index_js_1.defaultTestResourceRequirement, testAdapter, uberCatcher) {
        const fullAdapter = (0, index_js_1.DefaultAdapter)(testAdapter);
        super(testImplementation, testSpecification, input, class extends BaseSuite_js_1.BaseSuite {
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
        }, class Given extends BaseGiven_js_1.BaseGiven {
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
        }, class When extends BaseWhen_js_1.BaseWhen {
            async andWhen(store, whenCB, testResource, pm) {
                return await fullAdapter.andWhen(store, whenCB, testResource, pm);
            }
        }, class Then extends BaseThen_js_1.BaseThen {
            async butThen(store, thenCB, testResource, pm) {
                return await fullAdapter.butThen(store, thenCB, testResource, pm);
            }
        }, testResourceRequirement);
    }
}
exports.default = TesterantoCore;
