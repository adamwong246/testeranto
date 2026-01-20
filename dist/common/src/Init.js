"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    fs_1.default.copyFileSync(`node_modules/testeranto/dist/prebuild/Report.js`, `testeranto/Report.js`);
    fs_1.default.copyFileSync(`node_modules/testeranto/dist/prebuild/Report.css`, `testeranto/Report.css`);
    fs_1.default.copyFileSync(`node_modules/testeranto/dist/prebuild/ProcessManager.js`, `testeranto/ProcessManager.js`);
    fs_1.default.copyFileSync(`node_modules/testeranto/dist/prebuild/ProcessManager.css`, `testeranto/ProcessManager.css`);
    fs_1.default.copyFileSync(`node_modules/testeranto/dist/prebuild/Features.js`, `testeranto/ProcessManager.js`);
    fs_1.default.copyFileSync(`node_modules/testeranto/dist/prebuild/Features.css`, `testeranto/ProcessManager.css`);
};
