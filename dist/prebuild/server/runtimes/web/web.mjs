import {
  web_default
} from "../../../chunk-4KMVPZBT.mjs";
import {
  runBuild
} from "../../../chunk-IOVEJAE6.mjs";
import "../../../chunk-SFBHYNUJ.mjs";
import "../../../chunk-3X2YHN6Q.mjs";

// src/server/runtimes/web/web.ts
var isDev = process.argv.includes("dev");
runBuild(web_default, (config) => Object.keys(config.web.tests), "WEB");
