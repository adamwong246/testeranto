import fs from "fs";
import type { Plugin } from "esbuild";
import { IRunTime } from "../lib";
import path from 'path';

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
  const f = path.join(process.cwd(), `testeranto/metafiles/${platform}/${testName}.json`);
  const metafilesDir = path.join(process.cwd(), `testeranto/metafiles/${platform}`);
  
  if (!fs.existsSync(metafilesDir)) {
    fs.mkdirSync(metafilesDir, { recursive: true });
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
