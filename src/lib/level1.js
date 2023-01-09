import { createHash } from 'node:crypto';
import fs from "fs";
import path from "path";
import esbuild from "esbuild";
import { mapValues } from "lodash";
import { TesterantoLevelZero } from "./level0";
export class TesterantoLevelOne {
    constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, checkKlasser, testResource) {
        const classySuites = mapValues(testImplementation.Suites, () => (somestring, givens, checks) => new suiteKlasser.prototype.constructor(somestring, givens, checks));
        const classyGivens = mapValues(testImplementation.Givens, (z) => (features, whens, thens, ...xtrasW) => {
            return new givenKlasser.prototype.constructor(z.name, features, whens, thens, z(...xtrasW));
        });
        const classyWhens = mapValues(testImplementation.Whens, (whEn) => (payload) => new whenKlasser.prototype.constructor(`${whEn.name}: ${payload && payload.toString()}`, whEn(payload)));
        const classyThens = mapValues(testImplementation.Thens, (thEn) => (expected, x) => new thenKlasser.prototype.constructor(`${thEn.name}: ${expected && expected.toString()}`, thEn(expected)));
        const classyChecks = mapValues(testImplementation.Checks, (z) => (somestring, features, callback) => {
            return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
        });
        const classyTesteranto = new (class extends TesterantoLevelZero {
        })(input, classySuites, classyGivens, 
        /* @ts-ignore:next-line */
        classyWhens, classyThens, classyChecks);
        const suites = testSpecification(
        /* @ts-ignore:next-line */
        classyTesteranto.Suites(), classyTesteranto.Given(), classyTesteranto.When(), classyTesteranto.Then(), classyTesteranto.Check());
        /* @ts-ignore:next-line */
        const toReturn = suites.map((suite) => {
            return {
                test: suite,
                testResource,
                toObj: () => {
                    return suite.toObj();
                },
                runner: async (allocatedPorts) => {
                    return suite.run(input, { ports: allocatedPorts });
                },
                builder: (entryPath, featureFile) => {
                    const importPathPlugin = {
                        name: 'import-path',
                        setup(build) {
                            build.onResolve({ filter: /^\.{1,2}\// }, args => {
                                const importedPath = args.resolveDir + "/" + args.path;
                                const absolutePath = path.resolve(importedPath);
                                const absolutePath2 = path.resolve(featureFile).split(".ts").slice(0, -1).join('.ts');
                                if (absolutePath === absolutePath2) {
                                    return {
                                        path: process.cwd() + "/dist/tests/testerantoFeatures.test.js", external: true
                                    };
                                }
                                else {
                                    // return {
                                    //   path: path.resolve(importedPath), external: false
                                    // }
                                }
                                // let path = args.resolveDir + "/" + args.path;
                                // if (!fs.existsSync(path)) {
                                //   if (fs.existsSync(path + ".tsx")) {
                                //     path = path + ".tsx"
                                //   } else if (fs.existsSync(path + ".ts")) {
                                //     path = path + ".ts"
                                //   }
                                // }
                                // return { path, external: true }
                            });
                        },
                    };
                    console.log("level1 esbuild", entryPath);
                    esbuild.build({
                        entryPoints: [entryPath],
                        bundle: true,
                        minify: false,
                        format: "esm",
                        target: ["esnext"],
                        write: false,
                        packages: 'external',
                        plugins: [importPathPlugin],
                        external: [
                            // './src/*',
                            featureFile
                        ],
                    }).then((res) => {
                        var _a;
                        const text = res.outputFiles[0].text;
                        const p = "./dist/" + ((_a = (entryPath.split(process.cwd()).pop())) === null || _a === void 0 ? void 0 : _a.split(".ts")[0]) + '.js';
                        fs.promises.mkdir(path.dirname(p), { recursive: true }).then(x => {
                            var _a;
                            fs.promises.writeFile(p, text);
                            fs.promises.writeFile("./dist/" + ((_a = (entryPath.split(process.cwd()).pop())) === null || _a === void 0 ? void 0 : _a.split(".ts")[0]) + `.md5`, createHash('md5').update(text).digest('hex'));
                        });
                    });
                }
            };
        });
        return toReturn;
    }
}
