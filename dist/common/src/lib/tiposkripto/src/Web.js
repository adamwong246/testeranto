"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebTiposkripto = void 0;
const BaseTiposkripto_js_1 = __importDefault(require("./BaseTiposkripto.js"));
const types_js_1 = require("./types.js");
const config = {
    name: 'web',
    fs: 'testeranto/reports/allTests/example/Calculator.test/web',
    ports: [1111],
    files: [],
    timeout: 30000,
    retries: 3,
    environment: {}
};
class WebTiposkripto extends BaseTiposkripto_js_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedConfig = urlParams.get("config");
        const testResourceConfig = encodedConfig
            ? decodeURIComponent(encodedConfig)
            : "{}";
        super("web", input, testSpecification, testImplementation, testResourceRequirement, testAdapter, 
        // JSON.parse(testResourceConfig)
        config);
    }
    writeFileSync(filename, payload) {
        // Store files in a global object that can be accessed via Puppeteer
        if (!window.__testeranto_files__) {
            window.__testeranto_files__ = {};
        }
        window.__testeranto_files__[filename] = payload;
        // Also try to use the File System Access API if available
        if (navigator.storage && navigator.storage.getDirectory) {
            (async () => {
                try {
                    const root = await navigator.storage.getDirectory();
                    const fileHandle = await root.getFileHandle(filename, { create: true });
                    const writable = await fileHandle.createWritable();
                    await writable.write(payload);
                    await writable.close();
                }
                catch (e) {
                    console.warn('Could not write to browser storage:', e);
                }
            })();
        }
    }
}
exports.WebTiposkripto = WebTiposkripto;
const tiposkripto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = types_js_1.defaultTestResourceRequirement) => {
    try {
        const t = new WebTiposkripto(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
        // const data = navigator.storage.
        const root = await navigator.storage.getDirectory();
        // 1. Create (or get) a file handle
        const fileHandle = await root.getFileHandle(`${config.fs}/tests.json`);
        return t;
    }
    catch (e) {
        console.error(e);
        // Dispatch an error event
        const errorEvent = new CustomEvent("test-error", { detail: e });
        window.dispatchEvent(errorEvent);
        throw e;
    }
};
exports.default = tiposkripto;
