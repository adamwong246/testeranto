import webEsbuildConfig from "../../esbuildConfigs/web.js";
import { runBuild } from "./common.js";

// Check if we should serve (dev mode)
const isDev = process.argv.includes('dev');

// Always build, but never serve - Server_TCP will handle serving
runBuild(webEsbuildConfig, (config) => Object.keys(config.web.tests), "WEB");
