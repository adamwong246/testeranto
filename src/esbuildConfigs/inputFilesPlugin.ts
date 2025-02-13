import fs from "fs";
import path from "path";

export default (
  platform: "web" | "node",
  entryPoints: Set<string> | string[]
) => {
  return {
    name: "metafileWriter",
    setup(build) {
      build.onEnd((result) => {
        if (result.errors.length === 0) {
          entryPoints.forEach((entryPoint) => {
            const filePath = path.join(
              "./docs/",
              platform,
              entryPoint.split(".").slice(0, -1).join("."),
              `inputFiles.json`
            );

            const dirName = path.dirname(filePath);

            if (!fs.existsSync(dirName)) {
              fs.mkdirSync(dirName, { recursive: true });
            }

            fs.writeFileSync(
              filePath,
              JSON.stringify(
                Object.keys(
                  Object.keys(result.metafile.outputs)
                    .filter((s: string) => {
                      if (!result.metafile.outputs[s].entryPoint) {
                        return false;
                      }
                      return (
                        path.resolve(result.metafile.outputs[s].entryPoint) ===
                        path.resolve(entryPoint)
                      );
                    })
                    .reduce((mm: string[], el) => {
                      mm.push(result.metafile.outputs[el].inputs);
                      return mm;
                    }, [])[0]
                )
                  .filter((f: string) => {
                    const regex = /^src\/.*/g;
                    const matches = f.match(regex);
                    const passes = matches?.length === 1;
                    return passes;
                  })
                  .filter((f: string) => {
                    const regex = /.*\.test\..*/g;
                    const matches = f.match(regex);
                    const passes = matches?.length === 1;
                    return !passes;
                  })
              )
            );
          });
        }
      });
    },
  };
};
