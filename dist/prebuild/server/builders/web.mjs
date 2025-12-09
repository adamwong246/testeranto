import {
  runBuild
} from "../../chunk-3YUTIOB2.mjs";
import {
  web_default
} from "../../chunk-4KMVPZBT.mjs";
import "../../chunk-SFBHYNUJ.mjs";

// src/server/builders/web.ts
var isDev = process.argv.includes("dev");
runBuild(web_default, (config) => Object.keys(config.web.tests), "WEB");
