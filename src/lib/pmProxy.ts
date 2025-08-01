/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IPM } from "./types";

export type IProxyBase = (
  pm: IPM,
  mappings: [string, (...x: any) => any][]
) => IPM;

export type IProxy = (pm: IPM, filepath: string) => IPM;
export type IProxyAfterEach = (pm: IPM, suite: string, given: string) => IPM;
export type IProxyBeforeEach = (pm: IPM, suite: string) => IPM;

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
          return (...x) => (target[prop] as any)(arger(...x));
        }
      }

      return (...x) => target[prop](...x);
    },
  });
};

export const butThenProxy: IProxy = (pm: IPM, filepath: string) => {
  return baseProxy(pm, [
    [
      "screencast",
      (opts, p) => {
        const path = `${filepath}/butThen/${opts.path}`;
        (pm as any).currentStep?.artifacts?.push(path);
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
        (pm as any).currentStep?.artifacts?.push(path);
        return [path];
      },
    ],

    [
      "writeFileSync",
      (fp, contents) => {
        const path = `${filepath}/butThen/${fp}`;
        (pm as any).currentStep?.artifacts?.push(path);
        return [path, contents];
      },
    ],

    [
      "customScreenShot",
      (opts, p) => {
        const path = `${filepath}/butThen/${opts.path}`;
        (pm as any).currentStep?.artifacts?.push(path);
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

export const andWhenProxy: IProxy = (pm: IPM, filepath: string) =>
  baseProxy(pm, [
    [
      "screencast",
      (opts, p) => [
        {
          ...opts,
          path: `${filepath}/andWhen/${opts.path}`,
        },
        p,
      ],
    ],

    ["createWriteStream", (fp) => [`${filepath}/andWhen/${fp}`]],

    ["writeFileSync", (fp, contents) => [`${filepath}/andWhen${fp}`, contents]],

    [
      "customScreenShot",
      (opts, p) => [
        {
          ...opts,
          path: `${filepath}/andWhen${opts.path}`,
        },
        p,
      ],
    ],
  ]);

export const afterEachProxy: IProxyAfterEach = (
  pm: IPM,
  suite: string,
  given: string
): IPM =>
  baseProxy(pm, [
    [
      "screencast",
      (opts, p) => [
        {
          ...opts,
          path: `suite-${suite}/given-${given}/afterEach/${opts.path}`,
        },
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
        {
          ...opts,
          path: `suite-${suite}/given-${given}/afterEach/${opts.path}`,
        },
        p,
      ],
    ],
  ]);

export const beforeEachProxy: IProxyBeforeEach = (
  pm: IPM,
  suite: string
): IPM =>
  baseProxy(pm, [
    [
      "screencast",
      (opts, p) => [
        {
          ...opts,
          path: `suite-${suite}/beforeEach/${opts.path}`,
        },
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
        {
          ...opts,
          path: `suite-${suite}/beforeEach/${opts.path}`,
        },
        p,
      ],
    ],

    ["createWriteStream", (fp) => [`suite-${suite}/beforeEach/${fp}`]],
  ]);

export const beforeAllProxy: IProxy = (pm: IPM, suite: string): IPM =>
  baseProxy(pm, [
    [
      "writeFileSync",
      (fp, contents) => [`suite-${suite}/beforeAll/${fp}`, contents],
    ],

    [
      "customScreenShot",
      (opts, p) => [
        {
          ...opts,
          path: `suite-${suite}/beforeAll/${opts.path}`,
        },
        p,
      ],
    ],

    ["createWriteStream", (fp) => [`suite-${suite}/beforeAll/${fp}`]],
  ]);

export const afterAllProxy: IProxy = (pm: IPM, suite: string): IPM =>
  baseProxy(pm, [
    ["createWriteStream", (fp) => [`suite-${suite}/afterAll/${fp}`]],

    [
      "writeFileSync",
      (fp, contents) => [`suite-${suite}/afterAll/${fp}`, contents],
    ],

    [
      "customScreenShot",
      (opts, p) => [
        {
          ...opts,
          path: `suite-${suite}/afterAll/${opts.path}`,
        },
        p,
      ],
    ],
  ]);
