/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
export const butThenProxy = (pm, filepath) => baseProxy(pm, [
    [
        "screencast",
        (opts, p) => [
            Object.assign(Object.assign({}, opts), { path: `${filepath}/butThen/${opts.path}` }),
            p,
        ],
    ],
    ["createWriteStream", (fp) => [`${filepath}/butThen/${fp}`]],
    [
        "writeFileSync",
        (fp, contents) => [`${filepath}/butThen/${fp}`, contents],
    ],
    [
        "customScreenShot",
        (opts, p) => [
            Object.assign(Object.assign({}, opts), { path: `${filepath}/butThen/${opts.path}` }),
            p,
        ],
    ],
]);
export const andWhenProxy = (pm, filepath) => baseProxy(pm, [
    [
        "screencast",
        (opts, p) => [
            Object.assign(Object.assign({}, opts), { path: `${filepath}/andWhen/${opts.path}` }),
            p,
        ],
    ],
    ["createWriteStream", (fp) => [`${filepath}/andWhen/${fp}`]],
    ["writeFileSync", (fp, contents) => [`${filepath}/andWhen${fp}`, contents]],
    [
        "customScreenShot",
        (opts, p) => [
            Object.assign(Object.assign({}, opts), { path: `${filepath}/andWhen${opts.path}` }),
            p,
        ],
    ],
]);
export const afterEachProxy = (pm, suite, given) => baseProxy(pm, [
    [
        "screencast",
        (opts, p) => [
            Object.assign(Object.assign({}, opts), { path: `suite-${suite}/given-${given}/afterEach/${opts.path}` }),
            p,
        ],
    ],
    ["createWriteStream", (fp) => [`suite-${suite}/afterEach/${fp}`]],
    [
        "writeFileSync",
        (fp, contents) => [
            `suite-${suite}/given-${given}/afterEach/${fp}`,
            contents,
        ],
    ],
    [
        "customScreenShot",
        (opts, p) => [
            Object.assign(Object.assign({}, opts), { path: `suite-${suite}/given-${given}/afterEach/${opts.path}` }),
            p,
        ],
    ],
]);
export const beforeEachProxy = (pm, suite) => baseProxy(pm, [
    [
        "screencast",
        (opts, p) => [
            Object.assign(Object.assign({}, opts), { path: `suite-${suite}/beforeEach/${opts.path}` }),
            p,
        ],
    ],
    [
        "writeFileSync",
        (fp, contents) => [`suite-${suite}/beforeEach/${fp}`, contents],
    ],
    [
        "customScreenShot",
        (opts, p) => [
            Object.assign(Object.assign({}, opts), { path: `suite-${suite}/beforeEach/${opts.path}` }),
            p,
        ],
    ],
    ["createWriteStream", (fp) => [`suite-${suite}/beforeEach/${fp}`]],
]);
export const beforeAllProxy = (pm, suite) => baseProxy(pm, [
    [
        "writeFileSync",
        (fp, contents) => [`suite-${suite}/beforeAll/${fp}`, contents],
    ],
    [
        "customScreenShot",
        (opts, p) => [
            Object.assign(Object.assign({}, opts), { path: `suite-${suite}/beforeAll/${opts.path}` }),
            p,
        ],
    ],
    ["createWriteStream", (fp) => [`suite-${suite}/beforeAll/${fp}`]],
]);
export const afterAllProxy = (pm, suite) => baseProxy(pm, [
    ["createWriteStream", (fp) => [`suite-${suite}/afterAll/${fp}`]],
    [
        "writeFileSync",
        (fp, contents) => [`suite-${suite}/afterAll/${fp}`, contents],
    ],
    [
        "customScreenShot",
        (opts, p) => [
            Object.assign(Object.assign({}, opts), { path: `suite-${suite}/afterAll/${opts.path}` }),
            p,
        ],
    ],
]);
