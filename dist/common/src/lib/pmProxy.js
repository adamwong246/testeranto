"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.afterAllProxy = exports.beforeAllProxy = exports.beforeEachProxy = exports.afterEachProxy = exports.andWhenProxy = exports.butThenProxy = void 0;
const baseProxy = function (pm, mappings) {
    return new Proxy(pm, {
        get: (target, prop, receiver) => {
            for (const mapping of mappings) {
                const method = mapping[0];
                const arger = mapping[1];
                if (prop === method) {
                    return (...x) => target[prop](arger(...x));
                }
            }
            return (...x) => target[prop](...x);
        },
    });
};
const butThenProxy = (pm, filepath) => {
    return baseProxy(pm, [
        [
            "screencast",
            (opts, p) => {
                var _a;
                const path = `${filepath}/butThen/${opts.path}`;
                console.log(`[Proxy] Captured artifact path for butThen:`, path);
                if ((_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.addArtifact) {
                    pm.currentStep.addArtifact(path);
                }
                else {
                    console.warn('No currentStep or addArtifact method found');
                }
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
        ["createWriteStream", (fp) => {
                var _a;
                const path = `${filepath}/butThen/${fp}`;
                console.log(`[Proxy] Captured artifact path for butThen:`, path);
                if ((_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.addArtifact) {
                    pm.currentStep.addArtifact(path);
                }
                else {
                    console.warn('No currentStep or addArtifact method found');
                }
                return [path];
            }],
        [
            "writeFileSync",
            (fp, contents) => {
                var _a, _b;
                const path = `${filepath}/butThen/${fp}`;
                (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
                return [path, contents];
            },
        ],
        [
            "customScreenShot",
            (opts, p) => {
                var _a, _b;
                const path = `${filepath}/butThen/${opts.path}`;
                (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
    ]);
};
exports.butThenProxy = butThenProxy;
const andWhenProxy = (pm, filepath) => baseProxy(pm, [
    [
        "screencast",
        (opts, p) => {
            var _a, _b;
            const path = `${filepath}/andWhen/${opts.path}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [
                Object.assign(Object.assign({}, opts), { path }),
                p,
            ];
        },
    ],
    ["createWriteStream", (fp) => {
            var _a, _b;
            const path = `${filepath}/andWhen/${fp}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [path];
        }],
    ["writeFileSync", (fp, contents) => {
            var _a, _b;
            const path = `${filepath}/andWhen/${fp}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [path, contents];
        }],
    [
        "customScreenShot",
        (opts, p) => {
            var _a, _b;
            const path = `${filepath}/andWhen/${opts.path}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [
                Object.assign(Object.assign({}, opts), { path }),
                p,
            ];
        },
    ],
]);
exports.andWhenProxy = andWhenProxy;
const afterEachProxy = (pm, suite, given) => baseProxy(pm, [
    [
        "screencast",
        (opts, p) => {
            var _a, _b;
            const path = `suite-${suite}/given-${given}/afterEach/${opts.path}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [
                Object.assign(Object.assign({}, opts), { path }),
                p,
            ];
        },
    ],
    ["createWriteStream", (fp) => {
            var _a, _b;
            const path = `suite-${suite}/afterEach/${fp}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [path];
        }],
    [
        "writeFileSync",
        (fp, contents) => {
            var _a, _b;
            const path = `suite-${suite}/given-${given}/afterEach/${fp}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [path, contents];
        },
    ],
    [
        "customScreenShot",
        (opts, p) => {
            var _a, _b;
            const path = `suite-${suite}/given-${given}/afterEach/${opts.path}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [
                Object.assign(Object.assign({}, opts), { path }),
                p,
            ];
        },
    ],
]);
exports.afterEachProxy = afterEachProxy;
const beforeEachProxy = (pm, suite) => baseProxy(pm, [
    [
        "screencast",
        (opts, p) => {
            var _a, _b;
            const path = `suite-${suite}/beforeEach/${opts.path}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [
                Object.assign(Object.assign({}, opts), { path }),
                p,
            ];
        },
    ],
    [
        "writeFileSync",
        (fp, contents) => {
            var _a, _b;
            const path = `suite-${suite}/beforeEach/${fp}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [path, contents];
        },
    ],
    [
        "customScreenShot",
        (opts, p) => {
            var _a, _b;
            const path = `suite-${suite}/beforeEach/${opts.path}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [
                Object.assign(Object.assign({}, opts), { path }),
                p,
            ];
        },
    ],
    ["createWriteStream", (fp) => {
            var _a, _b;
            const path = `suite-${suite}/beforeEach/${fp}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [path];
        }],
]);
exports.beforeEachProxy = beforeEachProxy;
const beforeAllProxy = (pm, suite) => baseProxy(pm, [
    [
        "writeFileSync",
        (fp, contents) => {
            var _a, _b;
            const path = `suite-${suite}/beforeAll/${fp}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [path, contents];
        },
    ],
    [
        "customScreenShot",
        (opts, p) => {
            var _a, _b;
            const path = `suite-${suite}/beforeAll/${opts.path}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [
                Object.assign(Object.assign({}, opts), { path }),
                p,
            ];
        },
    ],
    ["createWriteStream", (fp) => {
            var _a, _b;
            const path = `suite-${suite}/beforeAll/${fp}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [path];
        }],
]);
exports.beforeAllProxy = beforeAllProxy;
const afterAllProxy = (pm, suite) => baseProxy(pm, [
    ["createWriteStream", (fp) => {
            var _a, _b;
            const path = `suite-${suite}/afterAll/${fp}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [path];
        }],
    [
        "writeFileSync",
        (fp, contents) => {
            var _a, _b;
            const path = `suite-${suite}/afterAll/${fp}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [path, contents];
        },
    ],
    [
        "customScreenShot",
        (opts, p) => {
            var _a, _b;
            const path = `suite-${suite}/afterAll/${opts.path}`;
            (_b = (_a = pm.currentStep) === null || _a === void 0 ? void 0 : _a.artifacts) === null || _b === void 0 ? void 0 : _b.push(path);
            return [
                Object.assign(Object.assign({}, opts), { path }),
                p,
            ];
        },
    ],
]);
exports.afterAllProxy = afterAllProxy;
