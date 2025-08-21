/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Do not add logging to this file as it is used by the pure runtime.

import { IPM } from "./types";

export type IProxyBase = (
  pm: IPM,
  mappings: [string, (...x: any) => any][]
) => IPM;

export type IProxy = (pm: IPM, filepath: string, step: any) => IPM;
export type IProxyAfterEach = (
  pm: IPM,
  suite: string,
  given: string,
  step: any
) => IPM;
export type IProxyBeforeEach = (pm: IPM, suite: string, step: any) => IPM;

export type IProxiedFunctions =
  | "screencast"
  | "createWriteStream"
  | "writeFileSync"
  | "customScreenShot";

const baseProxy: IProxyBase = function (
  pm: IPM,
  mappings: [IProxiedFunctions, (...x) => any][]
) {
  return new Proxy(pm, {
    get: (target, prop, receiver) => {
      for (const mapping of mappings) {
        const method = mapping[0];
        const arger = mapping[1];

        if (prop === method) {
          return (...x) => {
            // Add debug logging

            const modifiedArgs = arger(...x);

            return (target[prop] as any)(...modifiedArgs);
          };
        }
      }

      return (...x) => {
        return target[prop](...x);
      };
    },
  });
};

export const butThenProxy: IProxy = (
  pm: IPM,
  filepath: string,
  addArtifact
) => {
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
          {
            ...opts,
            path,
          },
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
        console.log(
          `[DEBUG] butThenProxy writeFileSync: fp="${fp}" (type: ${typeof fp}), contents="${contents}" (type: ${typeof contents}), testName="${testName}" (type: ${typeof testName})`
        );
        // Check if fp is being treated as individual characters
        if (typeof fp !== "string") {
          console.log(`[ERROR] fp is not a string:`, fp);
          // If fp is not a string, try to handle it
          if (Array.isArray(fp)) {
            // If it's an array, join it back into a string
            fp = fp.join("");
            console.log(`[DEBUG] Converted array to string: "${fp}"`);
          } else {
            // For other cases, convert to string
            fp = String(fp);
            console.log(`[DEBUG] Converted to string: "${fp}"`);
          }
        }
        const path = `${filepath}/butThen/${fp}`;
        console.log(`[DEBUG] Generated path: "${path}"`);
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
          {
            ...opts,
            path,
          },
          p,
        ];
      },
    ],
  ]);
};

export const andWhenProxy: IProxy = (
  pm: IPM,
  filepath: string,
  addArtifact
) => {
  return baseProxy(pm, [
    [
      "screencast",
      (opts, p) => {
        const path = `${filepath}/andWhen/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path,
          },
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
        // console.log("STEP2", JSON.stringify(step));
        addArtifact(path);
        return [
          {
            ...opts,
            path,
          },
          p,
        ];
      },
    ],
  ]);
};

export const afterEachProxy: IProxyAfterEach = (
  pm: IPM,
  suite: string,
  given: string,
  addArtifact
): IPM => {
  return baseProxy(pm, [
    [
      "screencast",
      (opts, p) => {
        const path = `suite-${suite}/given-${given}/afterEach/${opts.path}`;
        addArtifact(path);
        return [
          {
            ...opts,
            path,
          },
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
          {
            ...opts,
            path,
          },
          p,
        ];
      },
    ],
  ]);
};

export const beforeEachProxy: IProxyBeforeEach = (
  pm: IPM,
  suite: string,
  addArtifact
): IPM => {
  return baseProxy(pm, [
    [
      "screencast",
      (opts, p) => {
        const path = `suite-${suite}/beforeEach/${opts.path}`;
        addArtifact(path);

        return [
          {
            ...opts,
            path,
          },
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
          {
            ...opts,
            path,
          },
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

export const beforeAllProxy: IProxy = (
  pm: IPM,
  suite: string,
  addArtifact
): IPM => {
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
          {
            ...opts,
            path,
          },
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

export const afterAllProxy: IProxy = (
  pm: IPM,
  suite: string,
  addArtifact
): IPM => {
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
          {
            ...opts,
            path,
          },
          p,
        ];
      },
    ],
  ]);
};
