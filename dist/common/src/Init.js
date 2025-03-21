"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = async (partialConfig) => {
    const config = Object.assign(Object.assign({}, partialConfig), { buildDir: process.cwd() + "/" + partialConfig.outdir });
    try {
        fs_1.default.mkdirSync(`${process.cwd()}/${config.outdir}`);
    }
    catch (_a) {
        // console.log()
    }
    fs_1.default.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(Object.assign(Object.assign({}, config), { buildDir: process.cwd() + "/" + config.outdir }), null, 2));
    try {
        fs_1.default.mkdirSync(`${process.cwd()}/${config.outdir}/node`);
    }
    catch (_b) {
        // console.log()
    }
    try {
        fs_1.default.mkdirSync(`${process.cwd()}/${config.outdir}/web`);
    }
    catch (_c) {
        // console.log()
    }
    try {
        fs_1.default.mkdirSync(`${process.cwd()}/${config.outdir}/features`);
    }
    catch (_d) {
        // console.log()
    }
    try {
        fs_1.default.mkdirSync(`${process.cwd()}/${config.outdir}/ts`);
    }
    catch (_e) {
        // console.log()
    }
};
