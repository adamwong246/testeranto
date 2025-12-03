import nodeEsbuildConfig from "../esbuildConfigs/node.js";
import { runBuild } from "./common.js";

runBuild(
    nodeEsbuildConfig,
    (config) => Object.keys(config.node.tests),
    "NODE"
);
