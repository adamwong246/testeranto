import fs from "fs";
import path from "path";
const otherInputs = {};
const register = (entrypoint, sources) => {
    console.log("register", entrypoint, sources);
    if (!otherInputs[entrypoint]) {
        otherInputs[entrypoint] = new Set();
    }
    sources.forEach((s) => otherInputs[entrypoint].add(s));
};
export default (platform, entryPoints) => {
    return {
        register,
        inputFilesPluginFactory: {
            name: "metafileWriter",
            setup(build) {
                build.onEnd((result) => {
                    fs.writeFileSync(`docs/${platform}/metafile.json`, JSON.stringify(result, null, 2));
                    if (result.errors.length === 0) {
                        entryPoints.forEach((entryPoint) => {
                            const filePath = path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `inputFiles.json`);
                            const dirName = path.dirname(filePath);
                            if (!fs.existsSync(dirName)) {
                                fs.mkdirSync(dirName, { recursive: true });
                            }
                            const promptPath = path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `prompt.txt`);
                            const testPaths = path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `tests.json`);
                            const featuresPath = path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `features.json`);
                            if (result.metafile) {
                                const addableFiles = tree(result.metafile, entryPoint.split("/").slice(1).join("/"))
                                    .map((y) => {
                                    if (otherInputs[y]) {
                                        return Array.from(otherInputs[y]);
                                    }
                                    return y;
                                })
                                    .flat();
                                fs.writeFileSync(promptPath, `
${[...addableFiles]
                                    .map((x) => {
                                    return `/add ${x}`;
                                })
                                    .join("\n")}
/read ${testPaths}
/read ${featuresPath}
/code fix the failing tests described in ${testPaths}.
`);
                            }
                        });
                    }
                });
            },
        },
    };
};
function tree(meta, key) {
    return [
        key,
        ...meta.inputs[key].imports
            .filter((x) => x.external !== true)
            .filter((x) => x.path.split("/")[0] !== "node_modules")
            .map((f) => f.path),
    ];
}
