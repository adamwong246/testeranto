import fs from "fs";
const otherInputs = {};
const register = (entrypoint, sources) => {
    if (!otherInputs[entrypoint]) {
        otherInputs[entrypoint] = new Set();
    }
    sources.forEach((s) => otherInputs[entrypoint].add(s));
};
export default (platform, testName) => {
    const f = `${testName}`;
    // if (!fs.existsSync(``)) {
    //   fs.mkdirSync(``, { recursive: true });
    // }
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
