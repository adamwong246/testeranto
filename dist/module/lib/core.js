import { DefaultTestInterface, defaultTestResourceRequirement } from "./index.js";
import { BaseSuite, BaseGiven, BaseWhen, BaseThen, BaseCheck } from "./abstractBase";
import { ClassBuilder } from "./classBuilder";
const utils = {};
export default class Testeranto extends ClassBuilder {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, logWriter, testInterface, utils) {
        const fullTestInterface = DefaultTestInterface(testInterface);
        super(testImplementation, testSpecification, input, class extends BaseSuite {
            assertThat(t) {
                fullTestInterface.assertThis(t);
            }
            async setup(s, artifactory, tr) {
                return (fullTestInterface.beforeAll || (async (input, artifactory, tr) => input))(s, this.testResourceConfiguration, artifactory);
            }
        }, class Given extends BaseGiven {
            async givenThat(subject, testResource, artifactory, initializer) {
                return fullTestInterface.beforeEach(subject, initializer, (fPath, value) => 
                // TODO does not work?
                artifactory(`beforeEach/${fPath}`, value), testResource, this.initialValues);
            }
            afterEach(store, key, artifactory) {
                return new Promise((res) => res(fullTestInterface.afterEach(store, key, (fPath, value) => artifactory(`after/${fPath}`, value))));
            }
            afterAll(store, artifactory) {
                return fullTestInterface.afterAll(store, (fPath, value) => { artifactory(`afterAll4-${this.name}/${fPath}`, value); }, utils);
            }
        }, class When extends BaseWhen {
            async andWhen(store, whenCB, testResource) {
                return await fullTestInterface.andWhen(store, whenCB, testResource);
            }
        }, class Then extends BaseThen {
            async butThen(store, thenCB, testResourceConfiguration) {
                return await fullTestInterface.butThen(store, thenCB, testResourceConfiguration);
            }
        }, class Check extends BaseCheck {
            constructor(name, features, checkCallback, whens, thens, initialValues) {
                super(name, features, checkCallback, whens, thens);
                this.initialValues = initialValues;
            }
            async checkThat(subject, testResourceConfiguration, artifactory) {
                return fullTestInterface.beforeEach(subject, this.initialValues, (fPath, value) => artifactory(`before/${fPath}`, value), testResourceConfiguration, this.initialValues);
            }
            afterEach(store, key, artifactory) {
                return new Promise((res) => res(fullTestInterface.afterEach(store, key, (fPath, value) => 
                // TODO does not work?
                artifactory(`afterEach2-${this.name}/${fPath}`, value))));
            }
        }, testResourceRequirement, logWriter, utils);
    }
}
