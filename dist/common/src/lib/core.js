"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const index_js_1 = require("./index.js");
const abstractBase_js_1 = require("./abstractBase.js");
const classBuilder_js_1 = require("./classBuilder.js");
const BaseSuite_js_1 = require("./BaseSuite.js");
class TesterantoCore extends classBuilder_js_1.ClassBuilder {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = index_js_1.defaultTestResourceRequirement, testInterface, uberCatcher) {
        const fullTestInterface = (0, index_js_1.DefaultTestInterface)(testInterface);
        super(testImplementation, testSpecification, input, class extends BaseSuite_js_1.BaseSuite {
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
        }, class Given extends abstractBase_js_1.BaseGiven {
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
        }, class When extends abstractBase_js_1.BaseWhen {
            async andWhen(store, whenCB, testResource, pm) {
                return await fullTestInterface.andWhen(store, whenCB, testResource, pm);
            }
        }, class Then extends abstractBase_js_1.BaseThen {
            async butThen(store, thenCB, testResource, pm) {
                return await fullTestInterface.butThen(store, thenCB, testResource, pm);
            }
        }, class Check extends abstractBase_js_1.BaseCheck {
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
exports.default = TesterantoCore;
