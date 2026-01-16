import fs from "fs";
import type { Plugin } from "esbuild";
import { IRunTime } from "../Types";

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
