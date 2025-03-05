import fs from "fs";
import path from "path";
export default (platform, entryPoints) => {
    console.log("mark3", platform);
    return {
        name: "metafileWriter",
        setup(build) {
            build.onEnd((result) => {
                if (result.errors.length === 0) {
                    entryPoints.forEach((entryPoint) => {
                        console.log("mark1", entryPoint);
                        const filePath = path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `inputFiles.json`);
                        const dirName = path.dirname(filePath);
                        if (!fs.existsSync(dirName)) {
                            fs.mkdirSync(dirName, { recursive: true });
                        }
                        const jsonContent = JSON.stringify(Object.keys(Object.keys(result.metafile.outputs)
                            .filter((s) => {
                            if (!result.metafile.outputs[s].entryPoint) {
                                return false;
                            }
                            return (path.resolve(result.metafile.outputs[s].entryPoint) ===
                                path.resolve(entryPoint));
                        })
                            .reduce((mm, el) => {
                            mm.push(result.metafile.outputs[el].inputs);
                            return mm;
                        }, [])[0])
                            .filter((f) => {
                            const regex = /^src\/.*/g;
                            const matches = f.match(regex);
                            const passes = (matches === null || matches === void 0 ? void 0 : matches.length) === 1;
                            return passes;
                        })
                            .filter((f) => {
                            const regex = /.*\.test\..*/g;
                            const matches = f.match(regex);
                            const passes = (matches === null || matches === void 0 ? void 0 : matches.length) === 1;
                            return !passes;
                        }));
                        console.log("mark2", jsonContent);
                        fs.writeFileSync(filePath, jsonContent);
                    });
                }
            });
        },
    };
};
