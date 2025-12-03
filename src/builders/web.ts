import webEsbuildConfig from "../esbuildConfigs/web.js";
import { runBuild } from "./common.js";

runBuild(
    webEsbuildConfig,
    (config) => Object.keys(config.web.tests),
    "WEB"
);
