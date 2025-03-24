export class BaseSuite {
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
        });
        // .reduce((mm, lm) => {
        //   mm[lm] = lm;
        //   return mm;
        // }, {});
        return features || [];
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
        // console.log("\nSuite:", this.index, this.name);
        tLog("\nSuite:", this.index, this.name);
        const sNdx = this.index;
        const sName = this.name;
        for (const [gKey, g] of Object.entries(this.givens)) {
            // console.log("gKey", gKey);
            const beforeAllProxy = new Proxy(pm, {
                get(target, prop, receiver) {
                    if (prop === "customScreenShot") {
                        return (opts) => target.customScreenShot(Object.assign(Object.assign({}, opts), { 
                            // path: `${filepath}/${opts.path}`,
                            path: `suite-${sNdx}/beforeAll/${opts.path}` }));
                    }
                    if (prop === "writeFileSync") {
                        return (fp, contents) => target[prop](`suite-${sNdx}/beforeAll/${fp}`, contents);
                    }
                    return Reflect.get(...arguments);
                },
            });
            const subject = await this.setup(input, suiteArtifactory, testResourceConfiguration, beforeAllProxy);
            const giver = this.givens[gKey];
            try {
                this.store = await giver.give(subject, gKey, testResourceConfiguration, this.assertThat, suiteArtifactory, tLog, pm, sNdx);
            }
            catch (e) {
                console.error(e);
                this.fails.push(giver);
                // return this;
            }
        }
        try {
            this.afterAll(this.store, artifactory, 
            // afterAllProxy
            pm);
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
export class BaseGiven {
    constructor(name, features, whens, thens, givenCB, initialValues
    // key: string
    ) {
        this.name = name;
        this.features = features;
        this.whens = whens;
        this.thens = thens;
        this.givenCB = givenCB;
        this.initialValues = initialValues;
    }
    beforeAll(store, 
    // artifactory: ITestArtifactory
    // subject,
    initializer, artifactory, testResource, initialValues, pm) {
        return store;
    }
    toObj() {
        return {
            key: this.key,
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
        this.key = key;
        tLog(`\n ${this.key}`);
        tLog(`\n Given: ${this.name}`);
        const givenArtifactory = (fPath, value) => artifactory(`given-${this.key}/${fPath}`, value);
        try {
            // tLog(`\n Given this.store`, this.store);
            const beforeEachProxy = new Proxy(pm, {
                get(target, prop, receiver) {
                    if (prop === "writeFileSync") {
                        return (fp, contents) => target[prop](`suite-${suiteNdx}/given-${this.key}/when/beforeEach/${fp}`, contents);
                    }
                    if (prop === "customScreenShot") {
                        return (opts) => target.customScreenShot(Object.assign(Object.assign({}, opts), { path: `suite-${suiteNdx}/given-${this.key}/when/beforeEach/${opts.path}` }));
                    }
                    return Reflect.get(...arguments);
                },
            });
            this.uberCatcher((e) => {
                console.error(e);
                this.error = e.error;
                tLog(e.stack);
            });
            this.store = await this.givenThat(subject, testResourceConfiguration, givenArtifactory, this.givenCB, this.initialValues, beforeEachProxy);
            for (const [whenNdx, whenStep] of this.whens.entries()) {
                await whenStep.test(this.store, testResourceConfiguration, tLog, pm, `suite-${suiteNdx}/given-${this.key}/when/${whenNdx}`);
            }
            for (const [thenNdx, thenStep] of this.thens.entries()) {
                const t = await thenStep.test(this.store, testResourceConfiguration, tLog, pm, `suite-${suiteNdx}/given-${this.key}/then-${thenNdx}`);
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
                const afterEachProxy = new Proxy(pm, {
                    get(target, prop, receiver) {
                        if (prop === "customScreenShot") {
                            return (opts) => target.customScreenShot(Object.assign(Object.assign({}, opts), { path: `suite-${suiteNdx}/given-${this.key}/afterEach/${opts.path}` }));
                        }
                        if (prop === "writeFileSync") {
                            return (fp, contents) => target[prop](`suite-${suiteNdx}/given-${this.key}/afterEach/${fp}`, contents);
                        }
                        return Reflect.get(...arguments);
                    },
                });
                await this.afterEach(this.store, this.key, givenArtifactory, 
                // pm
                afterEachProxy);
            }
            catch (e) {
                console.error("afterEach failed! no error will be recorded!", e);
            }
        }
        return this.store;
    }
}
export class BaseWhen {
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
    async test(store, testResourceConfiguration, tLog, pm, filepath) {
        tLog(" When:", this.name);
        const name = this.name;
        const andWhenProxy = new Proxy(pm, {
            get(target, prop, receiver) {
                if (prop === "customScreenShot") {
                    return (opts) => target.customScreenShot(Object.assign(Object.assign({}, opts), { path: `${filepath}/${opts.path}` }));
                }
                if (prop === "writeFileSync") {
                    return (fp, contents) => target[prop](`${filepath}/andWhen/${fp}`, contents);
                }
                /////////////////////
                // if (prop === "browser") {
                //   return new Proxy(target[prop], {
                //     get(bTarget, bProp, bReceiver) {
                //       if (bProp === "pages") {
                //         return async () => {
                //           return bTarget.pages().then((pages) => {
                //             return pages.map((page) => {
                //               return new Proxy(page, {
                //                 get(pTarget, pProp, pReciever) {
                //                   // console.log("mark get", pTarget, pProp, pReciever);
                //                   if (pProp === "screenshot") {
                //                     return async (x) => {
                //                       return pm.customScreenShot(
                //                         {
                //                           ...x,
                //                           path:
                //                             `${testResourceConfiguration.fs}/${key}/afterEach` +
                //                             "/" +
                //                             x.path,
                //                         },
                //                         page
                //                       );
                //                     };
                //                   } else if (pProp === "mainFrame") {
                //                     return () => pTarget[pProp]();
                //                     // return target[pProp];
                //                     // return Reflect.get(...arguments);
                //                   } else if (pProp === "exposeFunction") {
                //                     // return Reflect.get(target, prop, receiver);
                //                     return pTarget[pProp].bind(pTarget);
                //                     // return target[pProp];
                //                   } else if (pProp === "removeExposedFunction") {
                //                     // return Reflect.get(target, prop, receiver);
                //                     return pTarget[pProp].bind(pTarget);
                //                     // return target[pProp];
                //                   } else if (pProp === "click") {
                //                     // console.log("mark12", arguments);
                //                     // return Reflect.get(target, prop, receiver);
                //                     // return pTarget[pProp].bind(pTarget);
                //                     // return target[pProp];
                //                     return (selector, options) => {
                //                       pTarget[pProp](selector, options);
                //                     };
                //                   } else if (pProp === "$eval") {
                //                     // return pTarget[pProp].bind(pTarget);
                //                     return (selector, options) => {
                //                       pTarget[pProp](selector, options);
                //                     };
                //                   } else if (pProp === "$") {
                //                     return Reflect.get(...arguments);
                //                     // return Reflect.get(target, prop, receiver);
                //                     // return pTarget[pProp].bind(pTarget);
                //                     // return target[pProp];
                //                     // return pTarget[pProp].bind(pTarget);
                //                     // return async (s) => {
                //                     //   console.log("mark17", s);
                //                     //   console.log("pTarget", pTarget);
                //                     //   console.log("pProp", pProp);
                //                     //   console.log("pReciever", pReciever);
                //                     //   // return "XXX";
                //                     //   // debugger;
                //                     //   return await pTarget[pProp](s);
                //                     // };
                //                   } else {
                //                     return Reflect.get(...arguments);
                //                   }
                //                 },
                //               });
                //             });
                //           });
                //           // return (await target.pages()).map((page) => {
                //           //   return new Proxy(page, handler2);
                //           // });
                //         };
                //       }
                //     },
                //   });
                // }
                ///////////////////////
                return Reflect.get(...arguments);
            },
        });
        return await this.andWhen(store, this.whenCB, testResourceConfiguration, andWhenProxy).catch((e) => {
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
export class BaseThen {
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
                    if (prop === "customScreenShot") {
                        return (opts) => target.customScreenShot(Object.assign(Object.assign({}, opts), { path: `${filepath}/${opts.path}` }));
                    }
                    if (prop === "writeFileSync") {
                        return (fp, contents) => target[prop](`${filepath}/${fp}`, contents);
                    }
                    return Reflect.get(...arguments);
                },
            });
            return this.butThen(store, this.thenCB, testResourceConfiguration, butThenProxy).catch((e) => {
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
export class BaseCheck {
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
