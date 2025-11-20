"use strict";
// import testeranto from "../Node";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiEndpoint = exports.Api = exports.ApiFilename = void 0;
var ApiFilename;
(function (ApiFilename) {
    ApiFilename["root"] = "./testeranto/index.html";
    ApiFilename["style"] = "./testeranto/App.css";
    ApiFilename["script"] = "./testeranto/App.js";
})(ApiFilename || (exports.ApiFilename = ApiFilename = {}));
exports.Api = {
    // ... other files
    testeranto: {
        api: {
            tests: "/api/projects/tests",
            report: "/api/projects/",
            files: "/api/files/",
        },
        app: {
            projects: {
                urls: "/api/projects",
                files: "./testeranto/projects.json",
            },
            root: {
                url: "/",
                file: "./testeranto/index.html",
            },
            css: {
                url: "/",
                file: "./testeranto/App.css",
            },
            script: {
                url: "/",
                file: "./testeranto/App.js",
            },
        },
    },
    // api: {
    //   projects: "/api/projects/",
    //   tests: "/api/projects/tests",
    //   report: "/api/projects/",
    //   files: "/api/files/",
    // },
    // testeranto: {
    //   root: {
    //     url: "/",
    //     file: "./testeranto/index.html",
    //   },
    //   css: {
    //     url: "/",
    //     file: "./testeranto/App.css",
    //   },
    //   css: {
    //     url: "/",
    //     file: "./testeranto/App.css",
    //   },
    // },
};
var ApiEndpoint;
(function (ApiEndpoint) {
    ApiEndpoint["root"] = "/testeranto/index.html";
    ApiEndpoint["style"] = "/testeranto/App.css";
    ApiEndpoint["script"] = "/testeranto/App.js";
})(ApiEndpoint || (exports.ApiEndpoint = ApiEndpoint = {}));
//
//
// files = "/api/files/",
// projects = "/api/projects/",
// tests = "/api/projects/tests",
// report = "/api/report",
// health = "/api/health",
// write = "/api/files/write",
// read = "/api/files/read",
