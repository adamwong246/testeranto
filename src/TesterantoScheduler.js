var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { cancelable } from 'cancelable-promise';
import fs from "fs";
import fresh from 'fresh-require';
import { topologicalSort } from 'graphology-dag/topological-sort';
const TIMEOUT = 3000;
const OPEN_PORT = '';
const testOutPath = "./dist/results/";
const featureOutPath = "./dist/";
const reportOutPath = "./dist/report";
export class TesterantoScheduler {
    constructor(portsToUse) {
        this.spinCycle = 0;
        this.spinAnimation = "←↖↑↗→↘↓↙";
        this.ports = {};
        portsToUse.forEach((port) => {
            this.ports[port] = OPEN_PORT;
        });
        this.queue = [];
        this.jobs = {};
        this.testSrcMd5s = {};
        this.featureTestJoin = {};
    }
    async abort(key) {
        if (this.jobs[key]) {
            console.log("aborting...", key, this.jobs[key]);
            await this.jobs[key].aborter();
            await this.jobs[key].cancellablePromise.cancel();
            delete this.jobs[key];
        }
    }
    launch() {
        setInterval(async () => {
            console.log(this.spinner(), this.queue.length, this.ports);
            const qi = this.queue.pop();
            if (!qi) {
                console.log('feed me some tests plz');
                return;
            }
            const { key, aborter, testResourceRequired, getCancellablePromise } = qi;
            this.abort(key);
            if (testResourceRequired === "na") {
                this.jobs[key] = {
                    aborter,
                    cancellablePromise: getCancellablePromise({}).then(() => delete this.jobs[key])
                };
            }
            if (testResourceRequired === "port") {
                Object.values(this.ports).forEach((jobMaybe, portNumber) => {
                    if (jobMaybe && jobMaybe === key) {
                        this.ports[portNumber] = OPEN_PORT;
                    }
                });
                const foundOpenPort = Object.keys(this.ports).find((p) => this.ports[p] === OPEN_PORT);
                if (foundOpenPort) {
                    const testPromise = getCancellablePromise({ port: foundOpenPort }).then(() => {
                        Object.keys(this.ports).forEach((p, k) => {
                            const jobExistsAndMatches = this.ports[p] === key;
                            if (jobExistsAndMatches) {
                                this.ports[p] = OPEN_PORT;
                            }
                        });
                        delete this.jobs[key];
                    });
                    this.ports[foundOpenPort] = key;
                    this.jobs[key] = {
                        aborter,
                        cancellablePromise: testPromise
                    };
                }
                else {
                    console.log(`no port was open so send the ${key} job to the back of the queue`);
                    this.queue.push(qi);
                }
            }
        }, TIMEOUT);
    }
    testFileTouched(key, distFile, className, hash) {
        if (hash !== this.testSrcMd5s[key]) {
            console.log("running", key);
            this.testSrcMd5s[key] = hash;
            this.addTest(new (fresh(distFile, require)[className])()[0], key);
        }
    }
    featureFileTouched(distFile, hash) {
        if (hash !== this.featureSrcMd5) {
            console.log("running featureSrcMd5");
            this.featureSrcMd5 = hash;
            this.setFeatures((fresh(distFile, require)['default']));
        }
        else {
            console.log("feature file changed byt md5 hash did not");
        }
    }
    async setFeatures(testerantoFeatures) {
        console.log("testerantoFeatures", testerantoFeatures.networks);
        this.testerantoFeatures = testerantoFeatures;
        await fs.promises.mkdir(featureOutPath, { recursive: true });
        await fs.writeFile(`${featureOutPath}TesterantoFeatures.json`, JSON.stringify(testerantoFeatures.networks, null, 2), (err) => {
            if (err) {
                console.error(err);
            }
        });
        this.regenerateReports();
    }
    async addTest(testJob, key) {
        // eslint-disable-next-line no-async-promise-executor
        const cancellablePromise = (allocatedTestResource) => cancelable(new Promise(async (resolve) => {
            var e_1, _a, e_2, _b, e_3, _c;
            const result = {
                test: testJob.test,
                status: await testJob.runner(allocatedTestResource)
            };
            await fs.promises.mkdir(testOutPath, { recursive: true });
            fs.writeFile(`${testOutPath}${key}.json`, JSON.stringify(testJob.test.toObj(), null, 2), (err) => {
                if (err) {
                    console.error(err);
                }
                resolve(result);
            });
            try {
                for (var _d = __asyncValues(result.test.givens), _e; _e = await _d.next(), !_e.done;) {
                    const given = _e.value;
                    try {
                        for (var _f = (e_2 = void 0, __asyncValues(given.features)), _g; _g = await _f.next(), !_g.done;) {
                            const givenFeature = _g.value;
                            try {
                                for (var _h = (e_3 = void 0, __asyncValues(this.testerantoFeatures.features)), _j; _j = await _h.next(), !_j.done;) {
                                    const knownFeature = _j.value;
                                    if (!this.featureTestJoin[givenFeature.name]) {
                                        this.featureTestJoin[givenFeature.name] = {};
                                    }
                                    if (givenFeature.name === knownFeature.name) {
                                        this.featureTestJoin[givenFeature.name][given.name] = {
                                            suite: result.test,
                                            whens: given.whens.map((w) => w.name),
                                            thens: given.thens.map((t) => t.name),
                                            errors: given.error,
                                        };
                                    }
                                    else {
                                        // delete this.featureTestJoin[givenFeature.name][given.name];
                                    }
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (_j && !_j.done && (_c = _h.return)) await _c.call(_h);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) await _b.call(_f);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) await _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            fs.writeFile(`${testOutPath}featureTestJoin.json`, JSON.stringify(Object.keys(this.featureTestJoin).reduce((mm, featureKey) => {
                mm[featureKey] = Object.keys(this.featureTestJoin[featureKey]).map((testKey) => {
                    const ranJob = this.featureTestJoin[featureKey][testKey];
                    return {
                        testKey: testKey,
                        name: ranJob.suite.name,
                        whens: ranJob.whens,
                        thens: ranJob.thens,
                        errors: ranJob.errors
                    };
                });
                return mm;
            }, {}), null, 2), (err) => {
                if (err) {
                    console.error(err);
                }
                resolve(result);
            });
            this.regenerateReports();
        }));
        this.queue.push({
            key,
            aborter: testJob.test.aborter,
            getCancellablePromise: cancellablePromise,
            testResourceRequired: testJob.testResource
        });
    }
    regenerateReports() {
        fs.writeFile(`${reportOutPath}.json`, JSON.stringify((this.testerantoFeatures.networks.map((network) => {
            const graph = network.graph;
            const topoSorted = topologicalSort(graph).reverse();
            {
                let i = 0;
                do {
                    const me = topoSorted[i];
                    graph.setNodeAttribute(me, 'testResults', this.featureTestJoin[me]);
                    i = i + 1;
                } while (i < topoSorted.length);
            }
            {
                let i = 0;
                do {
                    const me = topoSorted[i];
                    const myTestResults = graph.getNodeAttribute(me, 'testResults');
                    const anscestors = graph.inNeighbors(me);
                    if (anscestors.length === 1) {
                        const anscestor = anscestors[0];
                        graph.setNodeAttribute(anscestor, 'testResults', Object.assign(Object.assign({}, myTestResults), graph.getNodeAttribute(anscestor, 'testResults')));
                    }
                    else if (anscestors.length === 0) {
                        // no-op
                    }
                    else {
                        throw "topological sort fail";
                    }
                    i = i + 1;
                } while (i < topoSorted.length);
            }
            return {
                report: graph.getNodeAttribute(topoSorted[topoSorted.length - 1], 'testResults'),
                topoSorted,
                name: network.name
            };
        })), null, 2), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    spinner() {
        this.spinCycle = (this.spinCycle + 1) % this.spinAnimation.length;
        return this.spinAnimation[this.spinCycle];
    }
}
