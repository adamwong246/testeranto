"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const otherInputs = {};
const register = (entrypoint, sources) => {
    console.log("register", entrypoint, sources);
    if (!otherInputs[entrypoint]) {
        otherInputs[entrypoint] = new Set();
    }
    sources.forEach((s) => otherInputs[entrypoint].add(s));
};
function tree(meta, key) {
    console.log("searching metafile for", key);
    return [
        key,
        ...meta.inputs[key].imports.map((f) => path_1.default.resolve(f.path)),
        // .filter((f) => f.startsWith(`${process.cwd()}/src`)),
    ];
}
exports.default = (platform, entryPoints) => {
    return {
        register,
        inputFilesPluginFactory: {
            name: "metafileWriter",
            setup(build) {
                build.onEnd((result) => {
                    fs_1.default.writeFileSync(`docs/${platform}/metafile.json`, JSON.stringify(result, null, 2));
                    if (result.errors.length === 0) {
                        entryPoints.forEach((entryPoint) => {
                            const filePath = path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `inputFiles.json`);
                            const dirName = path_1.default.dirname(filePath);
                            if (!fs_1.default.existsSync(dirName)) {
                                fs_1.default.mkdirSync(dirName, { recursive: true });
                            }
                            const promptPath = path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `prompt.txt`);
                            const testPaths = path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `tests.json`);
                            const featuresPath = path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `featurePrompt.txt`);
                            if (result.metafile) {
                                const addableFiles = tree(result.metafile, entryPoint.split("/").slice(1).join("/"))
                                    .map((y) => {
                                    if (otherInputs[y]) {
                                        return Array.from(otherInputs[y]);
                                    }
                                    return y;
                                })
                                    .flat();
                                const typeErrorFiles = addableFiles.map((t) => `docs/types/${t}.type_errors.txt`);
                                fs_1.default.writeFileSync(promptPath, `
${[...addableFiles]
                                    .map((x) => {
                                    return `/add ${x}`;
                                })
                                    .join("\n")}
${[...typeErrorFiles]
                                    .map((x) => {
                                    // const f = `docs/types/${x}.type_errors.txt`;
                                    return `/read ${x}`;
                                    // if (fs.existsSync(f)) {
                                    //   return `/read ${f}`;
                                    // }
                                })
                                    .join("\n")}
/read ${testPaths}
/load ${featuresPath}
/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files [${typeErrorFiles.join(", ")}]. Implement any method which throws "Function not implemented."
`);
                            }
                        });
                    }
                });
            },
        },
    };
};
