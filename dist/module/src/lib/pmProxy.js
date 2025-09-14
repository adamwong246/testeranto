/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const baseProxy = function (pm, mappings) {
    return new Proxy(pm, {
        get: (target, prop, receiver) => {
            for (const mapping of mappings) {
                const method = mapping[0];
                const arger = mapping[1];
                if (prop === method) {
                    return (...x) => {
                        // Add debug logging
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
export const butThenProxy = (pm, filepath, addArtifact) => {
    return baseProxy(pm, [
        [
            "screencast",
            (opts, p) => {
                const path = `${filepath}/butThen/${opts.path}`;
                addArtifact(path);
                // console.log(
                //   `[ARTIFACT] Preparing to add to ${step.constructor.name}:`,
                //   path
                // );
                // try {
                //   console.log(
                //     `[ARTIFACT] Successfully added to ${step.constructor.name}`
                //   );
                //   console.log(`[ARTIFACT] Current artifacts:`, JSON.stringify(step.artifacts));
                // } catch (e) {
                //   console.error(`[ARTIFACT] Failed to add ${path}:`, e);
                //   throw e;
                // }
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
        [
            "createWriteStream",
            (fp) => {
                // Add debug logging to see what fp is
                // console.log(
                //   `[DEBUG] createWriteStream fp type: ${typeof fp}, value:`,
                //   fp
                // );
                // // Ensure fp is always a string
                // if (typeof fp !== "string") {
                //   console.error(
                //     `[PROXY ERROR] createWriteStream fp is not a string:`,
                //     fp
                //   );
                //   // Don't convert, just throw to find the source
                //   throw new Error(
                //     `createWriteStream expected string for fp, got ${typeof fp}: ${JSON.stringify(
                //       fp
                //     )}`
                //   );
                // }
                const path = `${filepath}/butThen/${fp}`;
                addArtifact(path);
                return [path];
            },
        ],
        [
            "writeFileSync",
            (fp, contents, testName) => {
                // Add debug logging to see what fp is
                // console.log(`[DEBUG] writeFileSync fp type: ${typeof fp}, value:`, fp);
                // Ensure fp is always a string
                // if (typeof fp !== "string") {
                //   console.error(`[PROXY ERROR] writeFileSync fp is not a string:`, fp);
                //   // Don't convert, just throw to find the source
                //   throw new Error(`writeFileSync expected string for fp, got ${typeof fp}: ${JSON.stringify(fp)}`);
                // }
                const path = `${filepath}/butThen/${fp}`;
                // console.log(`[DEBUG] Adding artifact: "${path}"`);
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
export const andWhenProxy = (pm, filepath, addArtifact) => {
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
                // // Add debug logging to see what fp is
                // console.log(
                //   `[DEBUG] andWhen createWriteStream fp type: ${typeof fp}, value:`,
                //   fp
                // );
                // if (typeof fp !== "string") {
                //   throw new Error(
                //     `andWhen createWriteStream expected string for fp, got ${typeof fp}: ${JSON.stringify(
                //       fp
                //     )}`
                //   );
                // }
                const path = `${filepath}/andWhen/${fp}`;
                addArtifact(path);
                return [path];
            },
        ],
        [
            "writeFileSync",
            (fp, contents, testName) => {
                // Add debug logging to see what fp is
                // console.log(
                //   `[DEBUG] andWhen writeFileSync fp type: ${typeof fp}, value:`,
                //   fp
                // );
                // if (typeof fp !== "string") {
                //   throw new Error(
                //     `andWhen writeFileSync expected string for fp, got ${typeof fp}: ${JSON.stringify(
                //       fp
                //     )}`
                //   );
                // }
                const path = `${filepath}/andWhen/${fp}`;
                addArtifact(path);
                return [path, contents, testName];
            },
        ],
        [
            "customScreenShot",
            (opts, p) => {
                const path = `${filepath}/andWhen/${opts.path}`;
                // console.log("STEP2", JSON.stringify(step));
                addArtifact(path);
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
    ]);
};
export const afterEachProxy = (pm, suite, given, addArtifact) => {
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
                // console.log("STEP3", JSON.stringify(step));
                return [
                    Object.assign(Object.assign({}, opts), { path }),
                    p,
                ];
            },
        ],
    ]);
};
export const beforeEachProxy = (pm, suite, addArtifact) => {
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
export const beforeAllProxy = (pm, suite, addArtifact) => {
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
export const afterAllProxy = (pm, suite, addArtifact) => {
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
