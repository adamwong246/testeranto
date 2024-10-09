"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const lib_1 = require("./lib");
class Testeranto extends base_1.ClassBuilder {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = lib_1.defaultTestResourceRequirement, logWriter, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen) {
        super(testImplementation, testSpecification, input, class extends base_1.BaseSuite {
            async setup(s, artifactory) {
                return (beforeAll || (async (input, artificer) => input))(s, artifactory, this.testResourceConfiguration);
            }
        }, class Given extends base_1.BaseGiven {
            async givenThat(subject, testResource, artifactory, initializer) {
                return beforeEach(subject, initializer, testResource, (fPath, value) => 
                // TODO does not work?
                artifactory(`beforeEach/${fPath}`, value), this.initialValues);
            }
            afterEach(store, key, artifactory) {
                return new Promise((res) => res(afterEach(store, key, (fPath, value) => artifactory(`after/${fPath}`, value))));
            }
            afterAll(store, artifactory) {
                return afterAll(store, (fPath, value) => 
                // TODO does not work?
                artifactory(`afterAll4-${this.name}/${fPath}`, value));
            }
        }, class When extends base_1.BaseWhen {
            async andWhen(store, whenCB, testResource) {
                return await andWhen(store, whenCB, testResource);
            }
        }, class Then extends base_1.BaseThen {
            async butThen(store, testResourceConfiguration) {
                const newState = await butThen(store, this.thenCB, testResourceConfiguration);
                return newState;
            }
        }, class Check extends base_1.BaseCheck {
            constructor(name, features, checkCallback, whens, thens, initialValues) {
                super(name, features, checkCallback, whens, thens);
                this.initialValues = initialValues;
            }
            async checkThat(subject, testResourceConfiguration, artifactory) {
                return beforeEach(subject, this.initialValues, testResourceConfiguration, (fPath, value) => artifactory(`before/${fPath}`, value), this.initialValues);
            }
            afterEach(store, key, artifactory) {
                return new Promise((res) => res(afterEach(store, key, (fPath, value) => 
                // TODO does not work?
                artifactory(`afterEach2-${this.name}/${fPath}`, value))));
            }
        }, testResourceRequirement, logWriter);
    }
}
exports.default = Testeranto;
