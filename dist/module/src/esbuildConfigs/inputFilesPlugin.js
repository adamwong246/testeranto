import fs from "fs";
import path from "path";
export default (platform, entryPoints) => {
    return {
        name: "metafileWriter",
        setup(build) {
            build.onEnd((result) => {
                if (result.errors.length === 0) {
                    entryPoints.forEach((entryPoint) => {
                        const filePath = path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `inputFiles.json`);
                        const promptPath = path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `prompt.txt`);
                        const testPaths = path.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `tests.json`);
                        const dirName = path.dirname(filePath);
                        if (!fs.existsSync(dirName)) {
                            fs.mkdirSync(dirName, { recursive: true });
                        }
                        const j = Object.keys(Object.keys(result.metafile.outputs)
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
                        }, [])[0]).filter((f) => {
                            const regex = /^src\/.*/g;
                            const matches = f.match(regex);
                            const passes = (matches === null || matches === void 0 ? void 0 : matches.length) === 1;
                            return passes;
                        });
                        // .filter((f: string) => {
                        //   const regex = /.*\.test\..*/g;
                        //   const matches = f.match(regex);
                        //   const passes = matches?.length === 1;
                        //   return !passes;
                        // })
                        const jsonContent = JSON.stringify(j);
                        fs.writeFileSync(filePath, jsonContent);
                        fs.writeFileSync(promptPath, `
${j
                            .map((x) => {
                            return `/add ${x}`;
                        })
                            .join("\n")}
/read ${testPaths}
  
/code fix the failing tests described in ${filePath}.
`);
                        //             fs.writeFileSync(
                        //               promptPath,
                        //               `
                        // from aider.coders import Coder
                        // from aider.models import Model
                        // import os
                        // model = Model("deepseek")
                        // coder = Coder.create(main_model=model)
                        // coder.run("/read-only", "${testPaths}")
                        // ${j
                        //   .map((x) => {
                        //     return `coder.run("/add", "${x}")`;
                        //   })
                        //   .join("\n")}
                        // coder.run("fix the failing tests described in ${filePath}.")
                        // `
                        //             );
                    });
                }
            });
        },
    };
};
