var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import fs from "fs";
import { watchFile } from 'node:fs';
import { Scheduler } from "./lib/Scheduler";
import { TesterantoProject } from "./Project";
const configFile = `${process.cwd()}/${process.argv[2]}`;
console.log("watch.ts configFile", configFile);
import(configFile).then((configModule) => {
    const tProject = new TesterantoProject(configModule.default[0], configModule.default[1], configModule.default[2]);
    console.log("build.ts tProject", tProject);
    const TRM = new Scheduler(tProject.ports);
    (async function () {
        var e_1, _a;
        try {
            for (var _b = __asyncValues(tProject.tests.entries()), _c; _c = await _b.next(), !_c.done;) {
                const [ndx, [key, sourcefile, className]] = _c.value;
                const distFile = "../dist/" + sourcefile.split(".ts")[0] + ".js";
                const md5File = "./dist/" + sourcefile.split(".ts")[0] + ".md5";
                fs.readFile(md5File, 'utf-8', (err, firstmd5hash) => {
                    TRM.testFileTouched(key, distFile, className, firstmd5hash);
                    watchFile(md5File, () => {
                        fs.readFile(md5File, 'utf-8', (err, newmd5Hash) => {
                            if (err) {
                                console.error(err);
                                process.exit(-1);
                            }
                            TRM.testFileTouched(key, distFile, className, newmd5Hash);
                        });
                    });
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const featureFile = tProject.features;
        const distFile = "../dist/" + featureFile.split(".ts")[0] + ".js";
        const md5File = "./dist/" + featureFile.split(".ts")[0] + ".md5";
        fs.readFile(featureFile, 'utf-8', (err, featuresFileContents) => {
            TRM.featureFileTouched(distFile, featuresFileContents);
            watchFile(md5File, () => {
                fs.readFile(md5File, 'utf-8', (err, newmd5Hash) => {
                    if (err) {
                        console.error(err);
                        process.exit(-1);
                    }
                    TRM.featureFileTouched(distFile, newmd5Hash);
                });
            });
        });
        TRM.launch();
    })();
});
