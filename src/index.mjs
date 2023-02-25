// import { DirectedGraph, UndirectedGraph } from 'graphology/dist/graphology.esm';
// import type { DirectedGraph } from "graphology-types";
class TesterantoGraph {
    constructor(name) {
        this.name = name;
    }
}
// export class TesterantoGraphUndirected implements TesterantoGraph {
//   name: string;
//   // graph: UndirectedGraph
//   constructor(name: string) {
//     this.name = name;
//     this.graph = new UndirectedGraph();
//   }
//   connect(a, b, relation?: string) {
//     this.graph.mergeEdge(a, b, { type: relation });
//   }
// }
// export class TesterantoGraphDirected implements TesterantoGraph {
//   name: string;
//   graph: DirectedGraph;
//   constructor(name: string) {
//     this.name = name;
//     this.graph = new DirectedGraph();
//   }
//   connect(to, from, relation?: string) {
//     this.graph.mergeEdge(to, from, { type: relation });
//   }
// }
// export class TesterantoGraphDirectedAcyclic implements TesterantoGraph {
//   name: string;
//   graph: DirectedGraph;
//   constructor(name: string) {
//     this.name = name;
//     this.graph = new DirectedGraph();
//   }
//   connect(to, from, relation?: string) {
//     this.graph.mergeEdge(to, from, { type: relation });
//   }
// }
export class TesterantoFeatures {
    constructor(features, graphs) {
        this.features = features;
        this.graphs = graphs;
    }
    networks() {
        return [
        // ...this.graphs.undirected.values(),
        // ...this.graphs.directed.values(),
        // ...this.graphs.dags.values()
        ];
    }
    toObj() {
        return {
            features: this.features.map((feature) => {
                return Object.assign({}, feature);
            }),
            // networks: this.networks().map((network) => {
            //   return {
            //     ...network
            //   }
            // })
        };
    }
}
export class TesterantoLevelZero {
    constructor(cc, suitesOverrides, givenOverides, whenOverides, thenOverides, checkOverides) {
        this.cc = cc;
        this.constructorator = cc;
        this.suitesOverrides = suitesOverrides;
        this.givenOverides = givenOverides;
        this.whenOverides = whenOverides;
        this.thenOverides = thenOverides;
        this.checkOverides = checkOverides;
    }
    Suites() {
        return this.suitesOverrides;
    }
    Given() {
        return this.givenOverides;
    }
    When() {
        return this.whenOverides;
    }
    Then() {
        return this.thenOverides;
    }
    Check() {
        return this.checkOverides;
    }
}
export class TesterantoLevelOne {
    constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResource) {
        const classySuites = Object.entries(testImplementation.Suites)
            .reduce((a, [key]) => {
            a[key] = (somestring, givens, checks) => {
                return new suiteKlasser.prototype.constructor(somestring, givens, checks);
            };
            return a;
        }, {});
        const classyGivens = Object.entries(testImplementation.Givens)
            .reduce((a, [key, z]) => {
            a[key] = (features, whens, thens, ...xtrasW) => {
                return new givenKlasser.prototype.constructor(z.name, features, whens, thens, z(...xtrasW));
            };
            return a;
        }, {});
        const classyWhens = Object.entries(testImplementation.Whens)
            .reduce((a, [key, whEn]) => {
            a[key] = (payload) => {
                return new whenKlasser.prototype.constructor(`${whEn.name}: ${payload && payload.toString()}`, whEn(payload));
            };
            return a;
        }, {});
        const classyThens = Object.entries(testImplementation.Thens)
            .reduce((a, [key, thEn]) => {
            a[key] = (expected, x) => {
                return new thenKlasser.prototype.constructor(`${thEn.name}: ${expected && expected.toString()}`, thEn(expected));
            };
            return a;
        }, {});
        const classyChecks = Object.entries(testImplementation.Checks)
            .reduce((a, [key, z]) => {
            a[key] = (somestring, features, callback) => {
                return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
            };
            return a;
        }, {});
        const classyTesteranto = new (class extends TesterantoLevelZero {
        })(input, classySuites, classyGivens, classyWhens, classyThens, classyChecks);
        const suites = testSpecification(
        /* @ts-ignore:next-line */
        classyTesteranto.Suites(), classyTesteranto.Given(), classyTesteranto.When(), classyTesteranto.Then(), classyTesteranto.Check());
        const toReturn = suites.map((suite) => {
            return {
                test: suite,
                testResource,
                toObj: () => {
                    return suite.toObj();
                },
                runner: async (allocatedPorts) => {
                    return suite.run(input, { ports: allocatedPorts });
                },
            };
        });
        return toReturn;
    }
}
export class BaseFeature {
    constructor(name) {
        this.name = name;
    }
}
export class BaseSuite {
    constructor(name, givens = [], checks = []) {
        this.name = name;
        this.givens = givens;
        this.checks = checks;
        this.fails = [];
    }
    async aborter() {
        this.aborted = true;
        await Promise.all((this.givens || []).map((g, ndx) => g.aborter(ndx)));
    }
    toObj() {
        return {
            name: this.name,
            givens: this.givens.map((g) => g.toObj()),
            fails: this.fails
        };
    }
    setup(s) {
        return new Promise((res) => res(s));
    }
    test(t) {
        return t;
    }
    async run(input, testResourceConfiguration) {
        this.testResourceConfiguration = Object.keys(testResourceConfiguration).length ? testResourceConfiguration : { ports: [] };
        const subject = await this.setup(input);
        console.log("\nSuite:", this.name, testResourceConfiguration);
        for (const [ndx, giver] of this.givens.entries()) {
            try {
                if (!this.aborted) {
                    this.store = await giver.give(subject, ndx, testResourceConfiguration, this.test);
                }
            }
            catch (e) {
                console.error(e);
                this.fails.push(giver);
                return false;
            }
        }
        for (const [ndx, thater] of this.checks.entries()) {
            await thater.check(subject, ndx, testResourceConfiguration, this.test);
        }
        return true;
    }
}
class TestArtifact {
    constructor(binary) {
        this.binary = binary;
    }
}
export class BaseGiven {
    constructor(name, features, whens, thens) {
        this.artifactSaver = {
            png: (testArtifact) => this.saveTestArtifact('afterEach', new TestArtifact(testArtifact))
        };
        this.name = name;
        this.features = features;
        this.whens = whens;
        this.thens = thens;
        this.testArtifacts = {};
    }
    toObj() {
        return {
            name: this.name,
            whens: this.whens.map((w) => w.toObj()),
            thens: this.thens.map((t) => t.toObj()),
            errors: this.error
        };
    }
    saveTestArtifact(k, testArtifact) {
        if (!this.testArtifacts[k]) {
            this.testArtifacts[k] = [];
        }
        this.testArtifacts[k].push(testArtifact);
    }
    async aborter(ndx) {
        this.abort = true;
        return Promise.all([
            ...this.whens.map((w, ndx) => new Promise((res) => res(w.aborter()))),
            ...this.thens.map((t, ndx) => new Promise((res) => res(t.aborter()))),
        ])
            .then(async () => {
            return await this.afterEach(this.store, ndx, this.artifactSaver);
        });
    }
    async afterEach(store, ndx, cb) {
        return;
    }
    async give(subject, index, testResourceConfiguration, tester) {
        console.log(`\n Given: ${this.name}`);
        try {
            if (!this.abort) {
                this.store = await this.givenThat(subject, testResourceConfiguration);
            }
            for (const whenStep of this.whens) {
                await whenStep.test(this.store, testResourceConfiguration);
            }
            for (const thenStep of this.thens) {
                const t = await thenStep.test(this.store, testResourceConfiguration);
                tester(t);
            }
        }
        catch (e) {
            this.error = e;
            console.log('\u0007'); // bell
            throw e;
        }
        finally {
            try {
                await this.afterEach(this.store, index, this.artifactSaver);
            }
            catch (_a) {
                console.error("afterEach failed! no error will be recorded!");
            }
        }
        return this.store;
    }
}
export class BaseWhen {
    constructor(name, actioner) {
        this.name = name;
        this.actioner = actioner;
    }
    toObj() {
        return {
            name: this.name,
            error: this.error,
        };
    }
    aborter() {
        this.abort = true;
        return this.abort;
    }
    async test(store, testResourceConfiguration) {
        console.log(" When:", this.name);
        if (!this.abort) {
            try {
                return await this.andWhen(store, this.actioner, testResourceConfiguration);
            }
            catch (e) {
                this.error = true;
                throw e;
            }
        }
    }
}
export class BaseThen {
    constructor(name, thenCB) {
        this.name = name;
        this.thenCB = thenCB;
    }
    toObj() {
        return {
            name: this.name,
            error: this.error,
        };
    }
    aborter() {
        this.abort = true;
        return this.abort;
    }
    async test(store, testResourceConfiguration) {
        if (!this.abort) {
            console.log(" Then:", this.name);
            try {
                return await this.thenCB(await this.butThen(store, testResourceConfiguration));
            }
            catch (e) {
                this.error = true;
                throw e;
            }
        }
    }
}
export class BaseCheck {
    constructor(name, features, checkCB, whens, thens) {
        this.name = name;
        this.features = features;
        this.checkCB = checkCB;
        this.whens = whens;
        this.thens = thens;
    }
    async afterEach(store, ndx, cb) {
        return;
    }
    async check(subject, ndx, testResourceConfiguration, tester) {
        console.log(`\n Check: ${this.name}`);
        const store = await this.checkThat(subject, testResourceConfiguration);
        await this.checkCB((Object.entries(this.whens)
            .reduce((a, [key, when]) => {
            a[key] = async (payload) => {
                return await when(payload, testResourceConfiguration).test(store, testResourceConfiguration);
            };
            return a;
        }, {})), (Object.entries(this.thens)
            .reduce((a, [key, then]) => {
            a[key] = async (payload) => {
                const t = await then(payload, testResourceConfiguration).test(store, testResourceConfiguration);
                tester(t);
            };
            return a;
        }, {})));
        await this.afterEach(store, ndx);
        return;
    }
}
export const Testeranto = async (input, testSpecification, testImplementation, 
// testImplementation: ITestImplementation<
//   InitialStateShape,
//   Selection,
//   WhenShape,
//   ThenShape,
//   TestShape
// >,
testResource, testInterface) => {
    const butThen = testInterface.butThen || (async (a) => a);
    const { andWhen } = testInterface;
    const actionHandler = testInterface.actionHandler || function (b) {
        return b;
    };
    const assertioner = testInterface.assertioner || (async (t) => t);
    const beforeAll = testInterface.beforeAll || (async (input) => input);
    const beforeEach = testInterface.beforeEach || async function (subject, initialValues, testResource) {
        return subject;
    };
    const afterEach = testInterface.afterEach || (async (s) => s);
    class MrT extends TesterantoLevelOne {
        constructor() {
            super(testImplementation, 
            /* @ts-ignore:next-line */
            testSpecification, input, (class extends BaseSuite {
                async setup(s) {
                    return beforeAll(s);
                }
                test(t) {
                    return assertioner(t);
                }
            }), class Given extends BaseGiven {
                constructor(name, features, whens, thens, initialValues) {
                    super(name, features, whens, thens);
                    this.initialValues = initialValues;
                }
                async givenThat(subject, testResource) {
                    return beforeEach(subject, this.initialValues, testResource);
                }
                afterEach(store, ndx, cb) {
                    return new Promise((res) => res(afterEach(store, ndx, cb)));
                }
            }, class When extends BaseWhen {
                constructor(name, actioner, payload) {
                    super(name, (store) => {
                        return actionHandler(actioner);
                    });
                    this.payload = payload;
                }
                async andWhen(store, actioner, testResource) {
                    return await andWhen(store, actioner, testResource);
                }
            }, class Then extends BaseThen {
                constructor(name, callback) {
                    super(name, callback);
                }
                async butThen(store, testResourceConfiguration) {
                    return await butThen(store, this.thenCB, testResourceConfiguration);
                }
            }, class Check extends BaseCheck {
                constructor(name, features, checkCallback, whens, thens, initialValues) {
                    super(name, features, checkCallback, whens, thens);
                    this.initialValues = initialValues;
                }
                async checkThat(subject, testResource) {
                    return beforeEach(subject, this.initialValues, testResource);
                }
                afterEach(store, ndx, cb) {
                    return new Promise((res) => res(afterEach(store, ndx, cb)));
                }
            }, testResource);
        }
    }
    const mrt = new MrT();
    console.log("requesting test resources from mothership...", testResource);
    /* @ts-ignore:next-line */
    process.send({
        type: 'testeranto:hola',
        data: {
            testResource
        }
    });
    console.log("awaiting test resources from mothership...");
    process.on('message', async function (packet) {
        console.log("message", packet);
        console.log("going!...");
        await mrt[0].runner(packet.data.goWithTestResources);
        console.log("done going with test resources!", mrt[0]);
        /* @ts-ignore:next-line */
        process.send({
            type: 'testeranto:adios',
            data: {
                testResource: mrt[0].test.testResourceConfiguration.ports,
                results: mrt[0].toObj()
            }
        });
        process.exit(0); // :-)
    });
    process.on('SIGINT', function () {
        var _a;
        console.log("SIGINT caught. Releasing test resources back to mothership...", mrt[0].test.testResourceConfiguration);
        /* @ts-ignore:next-line */
        process.send({
            type: 'testeranto:adios',
            data: {
                testResource: ((_a = mrt[0].test.testResourceConfiguration) === null || _a === void 0 ? void 0 : _a.ports) || []
            }
        });
        process.exit(0); // :-)
    });
};
