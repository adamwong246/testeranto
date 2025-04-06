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
  testName: string
): {
  register: (entrypoint: string, sources: string[]) => void;
  inputFilesPluginFactory: Plugin;
} => {
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
