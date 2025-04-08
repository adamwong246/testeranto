import type { Plugin } from "esbuild";
import { IRunTime } from "../lib";
declare const _default: (platform: IRunTime, testName: string) => {
    register: (entrypoint: string, sources: string[]) => void;
    inputFilesPluginFactory: Plugin;
};
export default _default;
