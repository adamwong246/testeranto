"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const readline_1 = __importDefault(require("readline"));
const path_1 = __importDefault(require("path"));
const main_1 = require("./PM/main");
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
console.log(ansi_colors_1.default.inverse("Press 'x' to shutdown forcefully."));
process.stdin.on("keypress", (str, key) => {
    if (key.name === "x") {
        console.log(ansi_colors_1.default.inverse("Shutting down forcefully..."));
        process.exit(-1);
    }
});
const mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
    console.error("the 2nd argument should be 'dev' or 'once' ");
    process.exit(-1);
}
Promise.resolve(`${process.cwd() + "/" + process.argv[2]}`).then(s => __importStar(require(s))).then(async (module) => {
    const testName = path_1.default.basename(process.argv[2]).split(".")[0];
    console.log("testeranto is testing", testName);
    const rawConfig = module.default;
    const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/" + `testeranto/${testName}.json` });
    const pm = new main_1.PM_Main(config, testName);
    pm.start();
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            pm.stop();
        }
    });
});
