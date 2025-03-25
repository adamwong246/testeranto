"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const otherInputs = {};
const register = (entrypoint, sources) => {
    if (!otherInputs[entrypoint]) {
        otherInputs[entrypoint] = new Set();
    }
    sources.forEach((s) => otherInputs[entrypoint].add(s));
};
function tree(meta, key) {
    const outputKey = Object.keys(meta.outputs).find((k) => {
        return meta.outputs[k].entryPoint === key;
    });
    if (!outputKey) {
        console.error("No outputkey found");
        process.exit(-1);
    }
    return Object.keys(meta.outputs[outputKey].inputs).filter((k) => k.startsWith("src"));
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
                            const stderrPath = path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `stderr.log`);
                            const stdoutPath = path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `stdout.log`);
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
                                // const featureFiles = addableFiles.map(
                                //   (t) =>
                                //     `docs/features/strings/${t
                                //       .split(".")
                                //       .slice(0, -1)
                                //       .join(".")}.features.txt`
                                // );
                                fs_1.default.writeFileSync(promptPath, `
${addableFiles
                                    .map((x) => {
                                    return `/add ${x}`;
                                })
                                    .join("\n")}
  
${typeErrorFiles
                                    .map((x) => {
                                    return `/read ${x}`;
                                })
                                    .join("\n")}


  
/read ${testPaths}
/read ${stdoutPath}
/read ${stderrPath}

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
