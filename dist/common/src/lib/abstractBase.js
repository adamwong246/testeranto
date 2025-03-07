"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCheck = exports.BaseThen = exports.BaseWhen = exports.BaseGiven = exports.BaseSuite = void 0;
class BaseSuite {
    constructor(name, index, givens = {}, checks = []) {
        this.name = name;
        this.index = index;
        this.givens = givens;
        this.checks = checks;
        this.fails = [];
    }
    features() {
        const features = Object.keys(this.givens)
            .map((k) => this.givens[k].features)
            .flat()
            .filter((value, index, array) => {
            return array.indexOf(value) === index;
        })
            .reduce((mm, lm) => {
            mm[lm] = lm;
            return mm;
        }, {});
        return features;
    }
    toObj() {
        const givens = Object.keys(this.givens).map((k) => this.givens[k].toObj());
        return {
            name: this.name,
            givens,
            fails: this.fails,
            features: this.features(),
        };
    }
    setup(s, artifactory, tr, pm) {
        return new Promise((res) => res(s));
    }
    assertThat(t) {
        return t;
    }
    afterAll(store, artifactory, pm) {
        return store;
    }
    async run(input, testResourceConfiguration, artifactory, tLog, pm) {
        this.testResourceConfiguration = testResourceConfiguration;
        tLog("test resources: ", JSON.stringify(testResourceConfiguration));
        const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
        console.log("\nSuite:", this.index, this.name);
        tLog("\nSuite:", this.index, this.name);
        const sNdx = this.index;
        const sName = this.name;
        for (const [gNdx, g] of Object.entries(this.givens)) {
            const beforeAllProxy = new Proxy(pm, {
                get(target, prop, receiver) {
                    if (prop === "writeFileSync") {
                        return (fp, contents) => target[prop](`suite-${sNdx}/beforeAll/${fp}`, contents);
                    }
                    if (prop === "browser") {
                        return new Proxy(target[prop], {
                            get(bTarget, bProp, bReceiver) {
                                if (bProp === "pages") {
                                    return async () => {
                                        return bTarget.pages().then((pages) => {
                                            return pages.map((page) => {
                                                return new Proxy(page, {
                                                    get(pTarget, pProp, pReciever) {
                                                        if (pProp === "screenshot") {
                                                            return async (x) => {
                                                                return pm.customScreenShot(Object.assign(Object.assign({}, x), { path: `${testResourceConfiguration.fs}/suite-${sNdx}/beforeAll` +
                                                                        "/" +
                                                                        x.path }), page);
                                                                // return await window["custom-screenshot"]({
                                                                //   ...x,
                                                                //   path:
                                                                //     `${testResourceConfiguration.fs}/suite-${sNdx}/afterAll` +
                                                                //     "/" +
                                                                //     x.path,
                                                                // });
                                                            };
                                                        }
                                                        else if (pProp === "mainFrame") {
                                                            return () => pTarget[pProp]();
                                                        }
                                                        else if (pProp === "close") {
                                                            return () => pTarget[pProp]();
                                                        }
                                                        // else if (pProp === "mainFrame") {
                                                        //   return () => target[pProp](...arguments);
                                                        // }
                                                        else {
                                                            return Reflect.get(...arguments);
                                                        }
                                                    },
                                                });
                                            });
                                        });
                                        // return (await target.pages()).map((page) => {
                                        //   return new Proxy(page, handler2);
                                        // });
                                    };
                                }
                            },
                        });
                    }
                    return Reflect.get(...arguments);
                },
            });
            const subject = await this.setup(input, suiteArtifactory, testResourceConfiguration, beforeAllProxy);
            const giver = this.givens[gNdx];
            try {
                this.store = await giver.give(subject, gNdx, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm, sNdx);
            }
            catch (e) {
                console.error(e);
                this.fails.push(giver);
                // return this;
            }
        }
        const afterAllProxy = new Proxy(pm, {
            get(target, prop, receiver) {
                if (prop === "writeFileSync") {
                    return (fp, contents) => target[prop](`suite-${sNdx}/afterAll/${fp}`, contents);
                }
                if (prop === "browser") {
                    return new Proxy(target[prop], {
                        get(bTarget, bProp, bReceiver) {
                            if (bProp === "pages") {
                                return async () => {
                                    return bTarget.pages().then((pages) => {
                                        return pages.map((page) => {
                                            return new Proxy(page, {
                                                get(pTarget, pProp, pReciever) {
                                                    if (pProp === "screenshot") {
                                                        return async (x) => {
                                                            return pm.customScreenShot(Object.assign(Object.assign({}, x), { path: `${testResourceConfiguration.fs}/suite-${sNdx}/afterAll` +
                                                                    "/" +
                                                                    x.path }));
                                                            // return await window["custom-screenshot"]({
                                                            //   ...x,
                                                            //   path:
                                                            //     `${testResourceConfiguration.fs}/suite-${sNdx}/afterAll` +
                                                            //     "/" +
                                                            //     x.path,
                                                            // });
                                                        };
                                                    }
                                                    else if (pProp === "mainFrame") {
                                                        return () => pTarget[pProp]();
                                                    }
                                                    else if (pProp === "close") {
                                                        return () => pTarget[pProp]();
                                                    }
                                                    // else if (pProp === "mainFrame") {
                                                    //   return () => target[pProp](...arguments);
                                                    // }
                                                    else {
                                                        return Reflect.get(...arguments);
                                                    }
                                                },
                                            });
                                        });
                                    });
                                    // return (await target.pages()).map((page) => {
                                    //   return new Proxy(page, handler2);
                                    // });
                                };
                            }
                        },
                    });
                }
                return Reflect.get(...arguments);
            },
        });
        // pm.browser
        try {
            this.afterAll(this.store, artifactory, afterAllProxy);
        }
        catch (e) {
            console.error(e);
            // this.fails.push(this);
            // return this;
        }
        // for (const [ndx, thater] of this.checks.entries()) {
        //   await thater.check(
        //     subject,
        //     thater.name,
        //     testResourceConfiguration,
        //     this.assertThat,
        //     suiteArtifactory,
        //     tLog,
        //     pm
        //   );
        // }
        // @TODO fix me
        // for (const k of Object.keys(this.givens)) {
        //   const giver = this.givens[k];
        //   try {
        //     giver.afterAll(this.store, artifactory, pm);
        //   } catch (e) {
        //     console.error(e);
        //     this.fails.push(giver);
        //     return this;
        //   }
        // }
        ////////////////
        return this;
    }
}
exports.BaseSuite = BaseSuite;
class BaseGiven {
    constructor(name, features, whens, thens, givenCB, initialValues) {
        this.name = name;
        this.features = features;
        this.whens = whens;
        this.thens = thens;
        this.givenCB = givenCB;
        this.initialValues = initialValues;
    }
    beforeAll(store, artifactory) {
        return store;
    }
    toObj() {
        return {
            name: this.name,
            whens: this.whens.map((w) => w.toObj()),
            thens: this.thens.map((t) => t.toObj()),
            error: this.error ? [this.error, this.error.stack] : null,
            // fail: this.fail ? [this.fail] : false,
            features: this.features,
        };
    }
    async afterEach(store, key, artifactory, pm) {
        return store;
    }
    async give(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm, suiteNdx) {
        tLog(`\n Given: ${this.name}`);
        const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
        try {
            // tLog(`\n Given this.store`, this.store);
            const beforeEachProxy = new Proxy(pm, {
                get(target, prop, receiver) {
                    if (prop === "writeFileSync") {
                        return (fp, contents) => target[prop](`suite-${suiteNdx}/given-${key}/when/beforeEach/${fp}`, contents);
                    }
                    return Reflect.get(...arguments);
                },
            });
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB, beforeEachProxy);
            // console.log("mark6", this.store);
            for (const [whenNdx, whenStep] of this.whens.entries()) {
                await whenStep.test(this.store, testResourceConfiguration, tLog, pm, `suite-${suiteNdx}/given-${key}/when/${whenNdx}`);
            }
            for (const [thenNdx, thenStep] of this.thens.entries()) {
                const t = await thenStep.test(this.store, testResourceConfiguration, tLog, pm, `suite-${suiteNdx}/given-${key}/then-${thenNdx}`);
                tester(t);
            }
        }
        catch (e) {
            console.error(e);
            this.error = e;
            tLog(e.stack);
            // tLog("\u0007"); // bell
            // throw e;
        }
        finally {
            try {
                // const afterEachProxy = new Proxy(pm, {
                //   get(target, prop, receiver) {
                //     if (prop === "writeFileSync") {
                //       console.log("afterEachProxy", arguments, target[prop]);
                //       return (fp, contents) =>
                //         // target[prop](`${key}/andWhen/${fp}`, contents);
                //         target[prop](`${key}/afterEach/${fp}`, contents);
                //     }
                //     return Reflect.get(...arguments);
                //   },
                // });
                // await this.afterEach(this.store, key, givenArtifactory, afterEachProxy);
                // await this.afterEach(this.store, key, givenArtifactory, pm);
                const afterEachProxy = new Proxy(pm, {
                    get(target, prop, receiver) {
                        if (prop === "writeFileSync") {
                            return (fp, contents) => target[prop](`suite-${suiteNdx}/given-${key}/afterAll/${fp}`, contents);
                        }
                        if (prop === "browser") {
                            return new Proxy(target[prop], {
                                get(bTarget, bProp, bReceiver) {
                                    if (bProp === "pages") {
                                        return async () => {
                                            return bTarget.pages().then((pages) => {
                                                return pages.map((page) => {
                                                    return new Proxy(page, {
                                                        get(pTarget, pProp, pReciever) {
                                                            if (pProp === "screenshot") {
                                                                return async (x) => {
                                                                    // console.log(
                                                                    //   "custom-screenshot-MARK-afterEachProxy",
                                                                    //   window["custom-screenshot"].toString()
                                                                    // );
                                                                    return pm.customScreenShot(Object.assign(Object.assign({}, x), { path: `${testResourceConfiguration.fs}/suite-${suiteNdx}/given-${key}/afterEach` +
                                                                            "/" +
                                                                            x.path }), page);
                                                                    // return await pTarget[pProp]({
                                                                    //   ...x,
                                                                    //   path:
                                                                    //     `${testResourceConfiguration.fs}/suite-${suiteNdx}/given-${key}/afterEach` +
                                                                    //     "/" +
                                                                    //     x.path,
                                                                    // });
                                                                };
                                                            }
                                                            else if (pProp === "mainFrame") {
                                                                return () => pTarget[pProp]();
                                                                // return target[pProp];
                                                                // return Reflect.get(...arguments);
                                                            }
                                                            else if (pProp === "exposeFunction") {
                                                                // return Reflect.get(target, prop, receiver);
                                                                return (...a) => pTarget[pProp](...a);
                                                                // return target[pProp];
                                                            }
                                                            else if (pProp === "removeExposedFunction") {
                                                                // return Reflect.get(target, prop, receiver);
                                                                return pTarget[pProp].bind(pTarget);
                                                                // return target[pProp];
                                                            }
                                                            // else if (pProp === "#frameManager") {
                                                            //   return () => target[pProp](...arguments);
                                                            // }
                                                            else {
                                                                return Reflect.get(...arguments);
                                                            }
                                                        },
                                                    });
                                                });
                                            });
                                            // return (await target.pages()).map((page) => {
                                            //   return new Proxy(page, handler2);
                                            // });
                                        };
                                    }
                                },
                            });
                        }
                        return Reflect.get(...arguments);
                    },
                });
                // console.log("mark5", this.store, key);
                await this.afterEach(this.store, key, givenArtifactory, afterEachProxy);
            }
            catch (e) {
                console.error("afterEach failed! no error will be recorded!", e);
            }
        }
        return this.store;
    }
}
exports.BaseGiven = BaseGiven;
class BaseWhen {
    constructor(name, whenCB) {
        this.name = name;
        this.whenCB = whenCB;
    }
    toObj() {
        return {
            name: this.name,
            error: this.error,
        };
    }
    async test(store, testResourceConfiguration, tLog, pm, key) {
        tLog(" When:", this.name);
        const name = this.name;
        const andWhenProxy = new Proxy(pm, {
            // set(obj, prop, value) {
            //   return Reflect.set(...arguments);
            //   // if (prop === "eyeCount" && value % 2 !== 0) {
            //   //   console.log("Monsters must have an even number of eyes");
            //   // } else {
            //   //   return Reflect.set(...arguments);
            //   // }
            // },
            get(target, prop, receiver) {
                if (prop === "writeFileSync") {
                    return (fp, contents) => 
                    // target[prop](`${key}/andWhen/${fp}`, contents);
                    target[prop](`${key}/andWhen/${fp}`, contents);
                }
                /////////////////////
                if (prop === "browser") {
                    return new Proxy(target[prop], {
                        get(bTarget, bProp, bReceiver) {
                            if (bProp === "pages") {
                                return async () => {
                                    return bTarget.pages().then((pages) => {
                                        return pages.map((page) => {
                                            return new Proxy(page, {
                                                get(pTarget, pProp, pReciever) {
                                                    // console.log("mark get", pTarget, pProp, pReciever);
                                                    if (pProp === "screenshot") {
                                                        return async (x) => {
                                                            return pm.customScreenShot(Object.assign(Object.assign({}, x), { path: `${testResourceConfiguration.fs}/${key}/afterEach` +
                                                                    "/" +
                                                                    x.path }), page);
                                                        };
                                                    }
                                                    else if (pProp === "mainFrame") {
                                                        return () => pTarget[pProp]();
                                                        // return target[pProp];
                                                        // return Reflect.get(...arguments);
                                                    }
                                                    else if (pProp === "exposeFunction") {
                                                        // return Reflect.get(target, prop, receiver);
                                                        return pTarget[pProp].bind(pTarget);
                                                        // return target[pProp];
                                                    }
                                                    else if (pProp === "removeExposedFunction") {
                                                        // return Reflect.get(target, prop, receiver);
                                                        return pTarget[pProp].bind(pTarget);
                                                        // return target[pProp];
                                                    }
                                                    else if (pProp === "click") {
                                                        // console.log("mark12", arguments);
                                                        // return Reflect.get(target, prop, receiver);
                                                        // return pTarget[pProp].bind(pTarget);
                                                        // return target[pProp];
                                                        return (selector, options) => {
                                                            // console.log("mark13", selector, options);
                                                            // debugger;
                                                            pTarget[pProp](selector, options);
                                                        };
                                                    }
                                                    else if (pProp === "$") {
                                                        return Reflect.get(...arguments);
                                                        // return Reflect.get(target, prop, receiver);
                                                        // return pTarget[pProp].bind(pTarget);
                                                        // return target[pProp];
                                                        // return pTarget[pProp].bind(pTarget);
                                                        // return async (s) => {
                                                        //   console.log("mark17", s);
                                                        //   console.log("pTarget", pTarget);
                                                        //   console.log("pProp", pProp);
                                                        //   console.log("pReciever", pReciever);
                                                        //   // return "XXX";
                                                        //   // debugger;
                                                        //   return await pTarget[pProp](s);
                                                        // };
                                                    }
                                                    else {
                                                        return Reflect.get(...arguments);
                                                    }
                                                },
                                            });
                                        });
                                    });
                                    // return (await target.pages()).map((page) => {
                                    //   return new Proxy(page, handler2);
                                    // });
                                };
                            }
                        },
                    });
                }
                ///////////////////////
                return Reflect.get(...arguments);
            },
        });
        return this.andWhen(store, this.whenCB, testResourceConfiguration, andWhenProxy).catch((e) => {
            this.error = true;
            // throw e;
        });
        // try {
        //   return await this.andWhen(
        //     store,
        //     this.whenCB,
        //     testResourceConfiguration,
        //     andWhenProxy
        //   );
        // } catch (e) {
        //   this.error = true;
        //   throw e;
        // }
    }
}
exports.BaseWhen = BaseWhen;
class BaseThen {
    constructor(name, thenCB) {
        this.name = name;
        this.thenCB = thenCB;
        this.error = false;
    }
    toObj() {
        return {
            name: this.name,
            error: this.error,
        };
    }
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        tLog(" Then:", this.name);
        try {
            const butThenProxy = new Proxy(pm, {
                get(target, prop, receiver) {
                    if (prop === "writeFileSync") {
                        return (fp, contents) => target[prop](`${filepath}/${fp}`, contents);
                    }
                    if (prop === "browser") {
                        return new Proxy(target[prop], {
                            get(bTarget, bProp, bReceiver) {
                                if (bProp === "pages") {
                                    return async () => {
                                        return bTarget.pages().then((pages) => {
                                            return pages.map((page) => {
                                                return new Proxy(page, {
                                                    get(pTarget, pProp, pReciever) {
                                                        if (pProp === "screenshot") {
                                                            return async (x) => {
                                                                return pm.customScreenShot(Object.assign(Object.assign({}, x), { path: `${testResourceConfiguration.fs}/${filepath}/butThen` +
                                                                        "/" +
                                                                        x.path }), page);
                                                                // return await window["custom-screenshot"]({
                                                                //   ...x,
                                                                //   path:
                                                                //     `${testResourceConfiguration.fs}/suite-${sNdx}/afterAll` +
                                                                //     "/" +
                                                                //     x.path,
                                                                // });
                                                            };
                                                        }
                                                        else if (pProp === "close") {
                                                            return () => pTarget[pProp]();
                                                        }
                                                        else if (pProp === "mainFrame") {
                                                            return () => pTarget[pProp]();
                                                        }
                                                        else if (pProp === "exposeFunction") {
                                                            // return Reflect.get(target, prop, receiver);
                                                            return (...a) => pTarget[pProp](...a);
                                                            // return target[pProp];
                                                        }
                                                        else if (pProp === "removeExposedFunction") {
                                                            // return Reflect.get(target, prop, receiver);
                                                            return pTarget[pProp].bind(pTarget);
                                                            // return target[pProp];
                                                        }
                                                        else {
                                                            return Reflect.get(...arguments);
                                                        }
                                                    },
                                                });
                                            });
                                        });
                                        // return (await target.pages()).map((page) => {
                                        //   return new Proxy(page, handler2);
                                        // });
                                    };
                                }
                            },
                        });
                    }
                    return Reflect.get(...arguments);
                },
            });
            // const x = await this.butThen(
            //   store,
            //   this.thenCB,
            //   testResourceConfiguration,
            //   butThenProxy
            // );
            // return x;
            return this.butThen(store, this.thenCB, testResourceConfiguration, butThenProxy).catch((e) => {
                console.log("mar123");
                this.error = true;
                throw e;
            });
        }
        catch (e) {
            console.log("test failed", e);
            this.error = e.message;
            throw e;
        }
    }
}
exports.BaseThen = BaseThen;
class BaseCheck {
    constructor(name, features, checkCB, whens, thens) {
        this.name = name;
        this.features = features;
        this.checkCB = checkCB;
        this.whens = whens;
        this.thens = thens;
    }
    async afterEach(store, key, cb, pm) {
        return;
    }
    async check(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm) {
        tLog(`\n Check: ${this.name}`);
        const store = await this.checkThat(subject, testResourceConfiguration, artifactory);
        await this.checkCB(Object.entries(this.whens).reduce((a, [key, when]) => {
            a[key] = async (payload) => {
                return await when(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog, pm, "x");
            };
            return a;
        }, {}), Object.entries(this.thens).reduce((a, [key, then]) => {
            a[key] = async (payload) => {
                const t = await then(payload, testResourceConfiguration).test(store, testResourceConfiguration, tLog, pm);
                tester(t);
            };
            return a;
        }, {}));
        await this.afterEach(store, key, () => { }, pm);
        return;
    }
}
exports.BaseCheck = BaseCheck;
