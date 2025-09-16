"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs_1 = __importDefault(require("fs"));
exports.default = async () => {
    [
        `testeranto/`,
        `testeranto/bundles/`,
        `testeranto/bundles/node`,
        `testeranto/bundles/web`,
        `testeranto/bundles/pure`,
        `testeranto/bundles/golang`,
        `testeranto/bundles/python`,
        `testeranto/reports/`,
        `testeranto/features/`,
        // `testeranto/externalTests/`,
        `testeranto/metafiles/`,
        `testeranto/metafiles/node`,
        `testeranto/metafiles/web`,
        `testeranto/metafiles/pure`,
        `testeranto/metafiles/golang`,
        `testeranto/metafiles/python`,
    ].forEach((f) => {
        try {
            fs_1.default.mkdirSync(`${process.cwd()}/${f}`);
        }
        catch (e) {
            console.error(e);
        }
    });
    fs_1.default.copyFileSync(`node_modules/testeranto/dist/prebuild/App.js`, `testeranto/App.js`);
    fs_1.default.copyFileSync(`node_modules/testeranto/dist/prebuild/App.css`, `testeranto/App.css`);
    // fs.copyFileSync(
    //   `node_modules/testeranto/dist/prebuild/ReportClient.js`,
    //   `testeranto/ReportClient.js`
    // );
    // fs.copyFileSync(
    //   `node_modules/testeranto/dist/prebuild/Project.css`,
    //   `testeranto/Project.css`
    // );
    // fs.copyFileSync(
    //   `node_modules/testeranto/dist/prebuild/ReportClient.css`,
    //   `testeranto/ReportClient.css`
    // );
    // fs.copyFileSync(
    //   `node_modules/testeranto/dist/prebuild/TestReport.js`,
    //   `testeranto/TestReport.js`
    // );
    // fs.copyFileSync(
    //   `node_modules/testeranto/dist/prebuild/TestReport.css`,
    //   `testeranto/TestReport.css`
    // );
};
