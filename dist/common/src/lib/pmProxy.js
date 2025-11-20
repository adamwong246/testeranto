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
                    return (...x) => {
                        const modifiedArgs = arger(...x);
                        return target[prop](...modifiedArgs);
                    };
                }
            }
            return (...x) => {
                return target[prop](...x);
            };
        },
    });
};
const butThenProxy = (pm, filepath, addArtifact) => {
    return baseProxy(pm, [
        [
            "screencast",
            (opts, p) => {
                const path = `${filepath}/butThen/${opts.path}`;
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
        [
            "createWriteStream",
            (fp) => {
                const path = `${filepath}/butThen/${fp}`;
                addArtifact(path);
                return [path];
            },
        ],
        [
            "writeFileSync",
            (fp, contents, testName) => {
                const path = `${filepath}/butThen/${fp}`;
                addArtifact(path);
                return [path, contents, testName];
            },
        ],
        [
            "customScreenShot",
            (opts, p) => {
                const path = `${filepath}/butThen/${opts.path}`;
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
    ]);
};
exports.butThenProxy = butThenProxy;
const andWhenProxy = (pm, filepath, addArtifact) => {
    return baseProxy(pm, [
        [
            "screencast",
            (opts, p) => {
                const path = `${filepath}/andWhen/${opts.path}`;
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
        [
            "createWriteStream",
            (fp) => {
                const path = `${filepath}/andWhen/${fp}`;
                addArtifact(path);
                return [path];
            },
        ],
        [
            "writeFileSync",
            (fp, contents, testName) => {
                const path = `${filepath}/andWhen/${fp}`;
                addArtifact(path);
                return [path, contents, testName];
            },
        ],
        [
            "customScreenShot",
            (opts, p) => {
                const path = `${filepath}/andWhen/${opts.path}`;
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
    ]);
};
exports.andWhenProxy = andWhenProxy;
const afterEachProxy = (pm, suite, given, addArtifact) => {
    return baseProxy(pm, [
        [
            "screencast",
            (opts, p) => {
                const path = `suite-${suite}/given-${given}/afterEach/${opts.path}`;
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
        [
            "createWriteStream",
            (fp) => {
                const path = `suite-${suite}/afterEach/${fp}`;
                addArtifact(path);
                return [path];
            },
        ],
        [
            "writeFileSync",
            (fp, contents, testName) => {
                const path = `suite-${suite}/given-${given}/afterEach/${fp}`;
                addArtifact(path);
                return [path, contents, testName];
            },
        ],
        [
            "customScreenShot",
            (opts, p) => {
                const path = `suite-${suite}/given-${given}/afterEach/${opts.path}`;
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
    ]);
};
exports.afterEachProxy = afterEachProxy;
const beforeEachProxy = (pm, suite, addArtifact) => {
    return baseProxy(pm, [
        [
            "screencast",
            (opts, p) => {
                const path = `suite-${suite}/beforeEach/${opts.path}`;
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
        [
            "writeFileSync",
            (fp, contents, testName) => {
                const path = `suite-${suite}/beforeEach/${fp}`;
                addArtifact(path);
                return [path, contents, testName];
            },
        ],
        [
            "customScreenShot",
            (opts, p) => {
                const path = `suite-${suite}/beforeEach/${opts.path}`;
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
        [
            "createWriteStream",
            (fp) => {
                const path = `suite-${suite}/beforeEach/${fp}`;
                addArtifact(path);
                return [path];
            },
        ],
    ]);
};
exports.beforeEachProxy = beforeEachProxy;
const beforeAllProxy = (pm, suite, addArtifact) => {
    return baseProxy(pm, [
        [
            "writeFileSync",
            (fp, contents, testName) => {
                const path = `suite-${suite}/beforeAll/${fp}`;
                addArtifact(path);
                return [path, contents, testName];
            },
        ],
        [
            "customScreenShot",
            (opts, p) => {
                const path = `suite-${suite}/beforeAll/${opts.path}`;
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
        [
            "createWriteStream",
            (fp) => {
                const path = `suite-${suite}/beforeAll/${fp}`;
                addArtifact(path);
                return [path];
            },
        ],
    ]);
};
exports.beforeAllProxy = beforeAllProxy;
const afterAllProxy = (pm, suite, addArtifact) => {
    return baseProxy(pm, [
        [
            "createWriteStream",
            (fp) => {
                const path = `suite-${suite}/afterAll/${fp}`;
                addArtifact(path);
                return [path];
            },
        ],
        [
            "writeFileSync",
            (fp, contents, testName) => {
                const path = `suite-${suite}/afterAll/${fp}`;
                addArtifact(path);
                return [path, contents, testName];
            },
        ],
        [
            "customScreenShot",
            (opts, p) => {
                const path = `suite-${suite}/afterAll/${opts.path}`;
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
    ]);
};
exports.afterAllProxy = afterAllProxy;
