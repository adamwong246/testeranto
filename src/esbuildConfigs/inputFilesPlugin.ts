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
  return [
    key,
    ...meta.inputs[key].imports
      .filter((x) => x.external !== true)
      .filter((x) => x.path.split("/")[0] !== "node_modules")
      .map((f) => f.path),
  ];
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
              ); // /read ${featuresPath}

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

                fs.writeFileSync(
                  promptPath,
                  `
${[...addableFiles]
  .map((x) => {
    return `/add ${x}`;
  })
  .join("\n")}
${[...addableFiles]
  .map((x) => {
    const f = `docs/ts/${x}.type_errors.txt`;

    if (fs.existsSync(f)) {
      return `/read ${f}`;
    }
  })
  .join("\n")}
/load ${featuresPath}
/code Fix the failing tests described in ${testPaths}. Correct any type signature errors. Implement any method which throws "Function not implemented."
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
