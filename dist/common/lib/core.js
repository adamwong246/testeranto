"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
const abstractBase_js_1 = require("./abstractBase.js");
const classBuilder_js_1 = require("./classBuilder.js");
class Testeranto extends classBuilder_js_1.ClassBuilder {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = index_js_1.defaultTestResourceRequirement, testInterface
    // puppetMaster: PM
    ) {
        const fullTestInterface = (0, index_js_1.DefaultTestInterface)(testInterface);
        super(testImplementation, testSpecification, input, class extends abstractBase_js_1.BaseSuite {
            afterAll(store, artifactory, pm) {
                // const pagesHandler = {
                //   get(target, prop) {
                //     console.log(`Getting pages property ${prop}`);
                //     return target[prop];
                //   },
                // };
                // const browserHandler = {
                //   get(target, prop) {
                //     console.log(`Getting browser property ${prop}`);
                //     if (prop === "pages") {
                //       // return target[prop];
                //       return new Proxy(target[prop], pagesHandler);
                //     } else {
                //       return target[prop];
                //     }
                //   },
                // };
                // const proxy = new Proxy(utils.browser, browserHandler);
                return fullTestInterface.afterAll(store, (fPath, value) => {
                    artifactory(`afterAll4-${this.name}/${fPath}`, value);
                }, pm);
            }
            assertThat(t) {
                fullTestInterface.assertThis(t);
            }
            async setup(s, artifactory, tr, pm) {
                return (fullTestInterface.beforeAll ||
                    (async (input, artifactory, tr, pm) => input))(s, this.testResourceConfiguration, artifactory, pm);
            }
        }, class Given extends abstractBase_js_1.BaseGiven {
            async givenThat(subject, testResource, artifactory, initializer, pm) {
                return fullTestInterface.beforeEach(subject, initializer, (fPath, value) => 
                // TODO does not work?
                artifactory(`beforeEach/${fPath}`, value), testResource, this.initialValues, pm);
            }
            afterEach(store, key, artifactory, pm) {
                return new Promise((res) => res(fullTestInterface.afterEach(store, key, (fPath, value) => artifactory(`after/${fPath}`, value), pm)));
            }
        }, class When extends abstractBase_js_1.BaseWhen {
            async andWhen(store, whenCB, testResource, pm) {
                return await fullTestInterface.andWhen(store, whenCB, testResource, pm);
            }
        }, class Then extends abstractBase_js_1.BaseThen {
            async butThen(store, thenCB, testResourceConfiguration) {
                return await fullTestInterface.butThen(store, thenCB, testResourceConfiguration);
            }
        }, class Check extends abstractBase_js_1.BaseCheck {
            constructor(name, features, checkCallback, whens, thens, initialValues) {
                super(name, features, checkCallback, whens, thens);
                this.initialValues = initialValues;
            }
            async checkThat(subject, testResourceConfiguration, artifactory, pm) {
                return fullTestInterface.beforeEach(subject, this.initialValues, (fPath, value) => artifactory(`before/${fPath}`, value), testResourceConfiguration, this.initialValues, pm);
            }
            afterEach(store, key, artifactory, pm) {
                return new Promise((res) => res(fullTestInterface.afterEach(store, key, (fPath, value) => 
                // TODO does not work?
                artifactory(`afterEach2-${this.name}/${fPath}`, value), pm)));
            }
        }, testResourceRequirement
        // puppetMaster
        );
    }
}
exports.default = Testeranto;
