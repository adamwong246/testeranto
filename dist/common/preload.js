"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const NodeWriter_1 = require("./NodeWriter");
const puppeteerConfiger_1 = __importDefault(require("./puppeteerConfiger"));
window.NodeWriter = NodeWriter_1.NodeWriter;
window.browser = new Promise(async (res, rej) => {
    const browser = await (0, puppeteerConfiger_1.default)("2999").then(async (json) => {
        const b = await puppeteer_core_1.default.connect({
            browserWSEndpoint: json.webSocketDebuggerUrl,
            defaultViewport: null,
        });
        console.log("connected!", b.isConnected());
        return res(b);
    });
});
