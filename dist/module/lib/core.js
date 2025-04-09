import { DefaultTestInterface, defaultTestResourceRequirement, } from "./index.js";
import { BaseSuite, BaseGiven, BaseWhen, BaseThen, BaseCheck, } from "./abstractBase.js";
import { ClassBuilder } from "./classBuilder.js";
export default class Testeranto extends ClassBuilder {
    constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testInterface, uberCatcher) {
        const fullTestInterface = DefaultTestInterface(testInterface);
        super(testImplementation, testSpecification, input, class extends BaseSuite {
            afterAll(store, artifactory, pm) {
                return fullTestInterface.afterAll(store, 
                // (fPath: string, value: unknown) =>
                //   // TODO does not work?
                //   {
                //     artifactory(`afterAll4-${this.name}/${fPath}`, value);
                //   },
                pm);
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
                try {
                    return await fullTestInterface.andWhen(store, whenCB, testResource, pm);
                }
                catch (e) {
                    throw e;
                }
                // return fullTestInterface
                //   .andWhen(store, whenCB, testResource, pm)
                //   .catch((e) => {
                //     throw e;
                //   });
                // return new Promise((res, rej) => {
                //   fullTestInterface.andWhen(store, whenCB, testResource, pm);
                // });
                // return await fullTestInterface.andWhen(
                //   store,
                //   whenCB,
                //   testResource,
                //   pm
                // );
            }
        }, class Then extends BaseThen {
            async butThen(store, thenCB, testResource, pm) {
                return await fullTestInterface
                    .butThen(store, thenCB, testResource, pm)
                    .then((v) => {
                    return v;
                }, (e) => {
                    console.log(" ERROR ", e);
                    throw e;
                });
                // try {
                //   console.log("mark 4");
                //   return await fullTestInterface.butThen(
                //     store,
                //     thenCB,
                //     testResource,
                //     pm
                //   );
                // } catch (e) {
                //   console.log("mar123");
                //   throw e;
                // }
                // return await fullTestInterface.butThen(
                //   store,
                //   thenCB,
                //   testResourceConfiguration,
                //   pm
                // );
            }
        }, class Check extends BaseCheck {
            constructor(name, features, checkCallback, whens, thens, initialValues) {
                super(name, features, whens, thens, checkCallback, initialValues);
                this.initialValues = initialValues;
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
