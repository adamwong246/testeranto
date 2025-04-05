import fs from "fs";
import type { Plugin } from "esbuild";

const otherInputs: Record<string, Set<string>> = {};

const register = (entrypoint: string, sources: string[]): void => {
  if (!otherInputs[entrypoint]) {
    otherInputs[entrypoint] = new Set();
  }
  sources.forEach((s) => otherInputs[entrypoint].add(s));
};

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
          // console.log("build.onEnd", entryPoints);
          fs.writeFileSync(
            `docs/${platform}/metafile.json`,
            JSON.stringify(result, null, 2)
          );
        });
      },
    },
  };
};
