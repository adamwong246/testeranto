import type { Plugin } from "esbuild";
declare const _default: (platform: "web" | "node", testName: string) => {
    register: (entrypoint: string, sources: string[]) => void;
    inputFilesPluginFactory: Plugin;
};
export default _default;
