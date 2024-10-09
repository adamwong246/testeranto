import { BaseWhen, BaseThen, BaseCheck, BaseSuite, BaseGiven, ClassBuilder } from "./base";
import { defaultTestResourceRequirement } from "./lib";
export default class Testeranto extends ClassBuilder {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, logWriter, beforeAll, beforeEach, afterEach, afterAll, butThen, andWhen, assertioner) {
        super(testImplementation, testSpecification, input, class extends BaseSuite {
            async setup(s, artifactory) {
                return (beforeAll || (async (input, artificer) => input))(s, artifactory, this.testResourceConfiguration);
            }
        }, class Given extends BaseGiven {
            constructor(name, features, whens, thens, givenCB, initialValues) {
                super(name, features, whens, thens, givenCB, initialValues);
            }
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
        }, class When extends BaseWhen {
            constructor(name, whenCB, payload) {
                super(name, whenCB);
                this.payload = payload;
            }
            async andWhen(store, whenCB, testResource) {
                return await andWhen(store, whenCB, testResource);
            }
        }, class Then extends BaseThen {
            constructor(name, thenCB) {
                super(name, thenCB);
            }
            assertion(x) {
                return assertioner(x);
            }
            async butThen(store, testResourceConfiguration) {
                const newState = await butThen(store, this.thenCB, testResourceConfiguration);
                // console.log("mark600", newState)
                // if (assertioner) {
                //   console.log("mark601", assertioner.toString())
                //   assertioner(newState);
                // }
                return newState;
            }
        }, class Check extends BaseCheck {
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
