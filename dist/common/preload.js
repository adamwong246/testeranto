"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const NodeWriter_1 = require("./NodeWriter");
window.NodeWriter = NodeWriter_1.NodeWriter;
const readJson = async (port) => new Promise((resolve, reject) => {
    let json = "";
    const request = http_1.default.request({
        host: "127.0.0.1",
        path: "/json/version",
        port,
    }, (response) => {
        response.on("error", reject);
        response.on("data", (chunk) => {
            json += chunk.toString();
        });
        response.on("end", () => {
            resolve(JSON.parse(json));
        });
    });
    request.on("error", reject);
    request.end();
});
window.browser = new Promise(async (res, rej) => {
    const browser = await readJson("2999").then(async (json) => {
        const b = await puppeteer_core_1.default.connect({
            browserWSEndpoint: json.webSocketDebuggerUrl,
            defaultViewport: null,
        });
        console.log("connected!", b.isConnected());
        return res(b);
    });
});
