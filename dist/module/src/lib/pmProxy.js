const prxy = function (pm, mappings) {
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
export const butThenProxy = (pm, filepath) => prxy(pm, [
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
export const andWhenProxy = (pm, filepath) => prxy(pm, [
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
export const afterEachProxy = (pm, suite, given) => prxy(pm, [
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
export const beforeEachProxy = (pm, suite) => prxy(pm, [
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
export const beforeAllProxy = (pm, suite) => prxy(pm, [
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
export const afterAllProxy = (pm, suite) => prxy(pm, [
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
/////////////////////////////////////////////////
// export const butThenProxy = (pm: IPM, filepath: string) => {
//   return new Proxy(pm, {
//     get: (target, prop, receiver) => {
//       if (prop === "customScreenShot") {
//         return (opts, p) =>
//           target.customScreenShot(
//             {
//               ...opts,
//               path: `${filepath}/${opts.path}`,
//             },
//             p
//           );
//       }
//       if (prop === "writeFileSync") {
//         return (fp, contents) => target[prop](`${filepath}/${fp}`, contents);
//       }
//     },
//   });
// };
// export const andWhenProxy = (pm: IPM, filepath: string) => {
//   return new Proxy(pm, {
//     get(target, prop, receiver) {
//       if (prop === "customScreenShot") {
//         return (opts, p) =>
//           target.customScreenShot(
//             {
//               ...opts,
//               path: `${filepath}/${opts.path}`,
//             },
//             p
//           );
//       }
//       if (prop === "writeFileSync") {
//         return (fp, contents) =>
//           target[prop](`${filepath}/andWhen/${fp}`, contents);
//       }
//       /* @ts-ignore:next-line */
//       return Reflect.get(...arguments);
//     },
//   });
// };
// export const afterEachProxy = (pm: IPM, suite: string, given: string): IPM => {
//   return new Proxy(pm, {
//     get(target, prop, receiver) {
//       if (prop === "customScreenShot") {
//         return (opts, p) =>
//           target.customScreenShot(
//             {
//               ...opts,
//               path: `suite-${suite}/given-${given}/afterEach/${opts.path}`,
//             },
//             p
//           );
//       }
//       if (prop === "writeFileSync") {
//         return (fp, contents) =>
//           target[prop](
//             `suite-${suite}/given-${given}/afterEach/${fp}`,
//             contents
//           );
//       }
//       /* @ts-ignore:next-line */
//       return Reflect.get(...arguments);
//     },
//   });
// };
// export const beforeAllProxy = (pm: IPM, suite: string): IPM => {
//   return new Proxy(pm, {
//     get(target, prop, receiver) {
//       if (prop === "customScreenShot") {
//         return (opts, p) =>
//           target.customScreenShot(
//             {
//               ...opts,
//               // path: `${filepath}/${opts.path}`,
//               path: `suite-${suite}/beforeAll/${opts.path}`,
//             },
//             p
//           );
//       }
//       if (prop === "writeFileSync") {
//         return (fp, contents) =>
//           target[prop](`suite-${suite}/beforeAll/${fp}`, contents);
//       }
//       /* @ts-ignore:next-line */
//       return Reflect.get(...arguments);
//     },
//   });
// };
// export const beforeEachProxy = (pm: IPM, suite: string, given: string): IPM => {
//   return new Proxy(pm, {
//     get(target, prop, receiver) {
//       // if (prop === "write") {
//       //   return (handle, contents) =>
//       //     target[prop](
//       //       `suite-${suiteNdx}/given-${key}/when/beforeEach/${fp}`,
//       //       contents
//       //     );
//       // }
//       if (prop === "createWriteStream") {
//         return (fp) =>
//           target[prop](`suite-${suite}/given-${given}/when/beforeEach/${fp}`);
//       }
//       if (prop === "writeFileSync") {
//         return (fp, contents) =>
//           target[prop](
//             `suite-${suite}/given-${given}/when/beforeEach/${fp}`,
//             contents
//           );
//       }
//       if (prop === "customScreenShot") {
//         return (opts, p) =>
//           target.customScreenShot(
//             {
//               ...opts,
//               path: `suite-${suite}/given-${given}/when/beforeEach/${opts.path}`,
//             },
//             p
//           );
//       }
//       if (prop === "screencast") {
//         return (opts, p) =>
//           target.screencast(
//             {
//               ...opts,
//               path: `suite-${suite}/given-${given}/when/beforeEach/${opts.path}`,
//             },
//             p
//           );
//       }
//       /* @ts-ignore:next-line */
//       return Reflect.get(...arguments);
//     },
//   });
// };
// export const afterAllProxy = (pm: IPM, suite: string): IPM => {
//   return new Proxy(pm, {
//     get(target, prop, receiver) {
//       if (prop === "customScreenShot") {
//         return (opts, p) =>
//           target.customScreenShot(
//             {
//               ...opts,
//               // path: `${filepath}/${opts.path}`,
//               path: `suite-${suite}/afterAll/${opts.path}`,
//             },
//             p
//           );
//       }
//       if (prop === "writeFileSync") {
//         return (fp, contents) =>
//           target[prop](`suite-${suite}/afterAll/${fp}`, contents);
//       }
//       /* @ts-ignore:next-line */
//       return Reflect.get(...arguments);
//     },
//   });
// };
