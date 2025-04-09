import fs from "fs";
const otherInputs = {};
const register = (entrypoint, sources) => {
    if (!otherInputs[entrypoint]) {
        otherInputs[entrypoint] = new Set();
    }
    sources.forEach((s) => otherInputs[entrypoint].add(s));
};
export default (platform, testName) => {
    const d = `testeranto/bundles/${platform}/${testName}/`;
    const f = `testeranto/bundles/${platform}/${testName}/metafile.json`;
    if (!fs.existsSync(d)) {
        fs.mkdirSync(d);
    }
    return {
        register,
        inputFilesPluginFactory: {
            name: "metafileWriter",
            setup(build) {
                build.onEnd((result) => {
                    fs.writeFileSync(f, JSON.stringify(result, null, 2));
                });
            },
        },
    };
};
