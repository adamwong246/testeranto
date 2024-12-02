import { DefaultTestInterface, defaultTestResourceRequirement, } from "./index.js";
import { BaseSuite, BaseGiven, BaseWhen, BaseThen, BaseCheck, } from "./abstractBase.js";
import { ClassBuilder } from "./classBuilder.js";
export default class Testeranto extends ClassBuilder {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testInterface
    // puppetMaster: PM
    ) {
        const fullTestInterface = DefaultTestInterface(testInterface);
        super(testImplementation, testSpecification, input, class extends BaseSuite {
            assertThat(t) {
                fullTestInterface.assertThis(t);
            }
            async setup(s, artifactory, tr, pm) {
                console.log("mark12");
                return (fullTestInterface.beforeAll ||
                    (async (input, artifactory, tr, pm) => input))(s, this.testResourceConfiguration, artifactory, pm);
            }
        }, class Given extends BaseGiven {
            async givenThat(subject, testResource, artifactory, initializer, pm) {
                return fullTestInterface.beforeEach(subject, initializer, (fPath, value) => 
                // TODO does not work?
                artifactory(`beforeEach/${fPath}`, value), testResource, this.initialValues, pm);
            }
            afterEach(store, key, artifactory, pm) {
                return new Promise((res) => res(fullTestInterface.afterEach(store, key, (fPath, value) => artifactory(`after/${fPath}`, value), pm)));
            }
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
                }, pm
                // {
                //   ...utils,
                //   browser: proxy,
                // }
                );
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
