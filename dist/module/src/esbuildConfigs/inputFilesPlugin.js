import fs from "fs";
const otherInputs = {};
const register = (entrypoint, sources) => {
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
                    console.log("build.onEnd", entryPoints);
                    fs.writeFileSync(`docs/${platform}/metafile.json`, JSON.stringify(result, null, 2));
                });
            },
        },
    };
};
