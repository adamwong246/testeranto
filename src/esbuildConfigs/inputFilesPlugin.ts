import fs from "fs";
import type { Plugin } from "esbuild";
import { IRunTime } from "../tiposkripto";

const otherInputs: Record<string, Set<string>> = {};

const register = (entrypoint: string, sources: string[]): void => {
  if (!otherInputs[entrypoint]) {
    otherInputs[entrypoint] = new Set();
  }
  sources.forEach((s) => otherInputs[entrypoint].add(s));
};

export default (
  platform: IRunTime,
  testName: string
): {
  register: (entrypoint: string, sources: string[]) => void;
  inputFilesPluginFactory: Plugin;
} => {
  const f = `testeranto/metafiles/${platform}/${testName}.json`;
  if (!fs.existsSync(`testeranto/metafiles/${platform}`)) {
    fs.mkdirSync(`testeranto/metafiles/${platform}`, { recursive: true });
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
