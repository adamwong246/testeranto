import fs from "fs";
import path from "path";
import type { ImportKind, Metafile, Plugin } from "esbuild";

const otherInputs: Record<string, Set<string>> = {};

const register = (entrypoint: string, sources: string[]): void => {
  console.log("register", entrypoint, sources);
  if (!otherInputs[entrypoint]) {
    otherInputs[entrypoint] = new Set();
  }
  sources.forEach((s) => otherInputs[entrypoint].add(s));
};

function tree(meta: Metafile, key: string) {
  console.log("searching metafile for", key);

  const outputKey = Object.keys(meta.outputs).find((k) => {
    return meta.outputs[k].entryPoint === key;
  });

  if (!outputKey) {
    console.error("No outputkey found");
    process.exit(-1);
  }

  return Object.keys(meta.outputs[outputKey].inputs).filter((k) =>
    k.startsWith("src")
  );
}

export default (
  platform: "web" | "node",
  entryPoints: Set<string> | string[]
): {
  register: (entrypoint: string, sources: string[]) => void;
  inputFilesPluginFactory: Plugin;
} => {
  return {
    register,

    inputFilesPluginFactory: {
      name: "metafileWriter",
      setup(build) {
        build.onEnd((result) => {
          fs.writeFileSync(
            `docs/${platform}/metafile.json`,
            JSON.stringify(result, null, 2)
          );

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

              const promptPath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `prompt.txt`
              );
              const testPaths = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `tests.json`
              );
              const featuresPath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `featurePrompt.txt`
              );

              if (result.metafile) {
                const addableFiles = tree(
                  result.metafile,
                  entryPoint.split("/").slice(1).join("/")
                )
                  .map((y) => {
                    if (otherInputs[y]) {
                      return Array.from(otherInputs[y]);
                    }
                    return y;
                  })
                  .flat();

                const typeErrorFiles = addableFiles.map(
                  (t) => `docs/types/${t}.type_errors.txt`
                );

                fs.writeFileSync(
                  promptPath,
                  `
${addableFiles
  .map((x) => {
    return `/add ${x}`;
  })
  .join("\n")}
  
${typeErrorFiles
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
/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files [${typeErrorFiles.join(
                    ", "
                  )}]. Implement any method which throws "Function not implemented."
`
                );
              }
            });
          }
        });
      },
    },
  };
};
